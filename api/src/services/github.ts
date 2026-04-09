import { Octokit } from '@octokit/rest';
import type { RequestError } from '@octokit/request-error';

export type RepoInfo = {
  defaultBranch: string;
  private: boolean;
  fullName: string;
};

export type CommitFile = {
  filename: string;
  patch?: string; // the diff/patch for this file
  status: string; // added | modified | removed | renamed
};

export type CommitInfo = {
  sha: string;
  message: string;
  files: CommitFile[];
};

export type PullRequestDiff = {
  number: number;
  title: string;
  files: CommitFile[];
};

/**
 * Verify repo access and return its actual default branch.
 * Throws a clear human-readable error on 401/404.
 */
export const getRepoInfo = async (
  owner: string,
  repo: string,
  token: string,
): Promise<RepoInfo> => {
  const octokit = new Octokit({ auth: token });
  try {
    const { data } = await octokit.repos.get({ owner, repo });
    return {
      defaultBranch: data.default_branch,
      private: data.private,
      fullName: data.full_name,
    };
  } catch (err) {
    const e = err as RequestError;
    if (e.status === 404) {
      throw new Error(
        `Repository "${owner}/${repo}" not found. Check the owner and repo name, and make sure your token has "repo" scope for private repos.`,
      );
    }
    if (e.status === 401) {
      throw new Error(
        'GitHub token is invalid or expired. Generate a new Personal Access Token with "repo" scope.',
      );
    }
    throw err;
  }
};

/**
 * Fetch up to the latest 5 commits made after `sinceSha` on the branch.
 * If `sinceSha` is null, fetches the latest 5 commits.
 */
export const getCommitsSince = async (
  owner: string,
  repo: string,
  branch: string,
  token: string,
  sinceSha: string | null,
): Promise<CommitInfo[]> => {
  const octokit = new Octokit({ auth: token });

  // Get list of commits on the branch
  const commitsResponse = await octokit.repos.listCommits({
    owner,
    repo,
    sha: branch,
    per_page: 5,
  });

  const commits = commitsResponse.data;

  // If we have a previous SHA, only process commits after it
  const previousCommitIndex = sinceSha
    ? commits.findIndex(c => c.sha === sinceSha)
    : -1;

  const newCommits = previousCommitIndex >= 0
    ? commits.slice(0, previousCommitIndex)
    : commits.slice(0, 5);

  if (newCommits.length === 0) return [];

  // For each commit fetch its changed files
  const detailed = await Promise.all(
    newCommits.slice(0, 5).map(async commit => {
      const detail = await octokit.repos.getCommit({
        owner,
        repo,
        ref: commit.sha,
      });
      const files: CommitFile[] = (detail.data.files || []).map(f => ({
        filename: f.filename,
        patch: f.patch,
        status: f.status,
      }));
      return {
        sha: commit.sha,
        message: commit.commit.message,
        files,
      };
    }),
  );

  return detailed;
};

/**
 * Fetch open pull requests and their changed file diffs.
 */
export const getOpenPullRequestDiffs = async (
  owner: string,
  repo: string,
  token: string,
): Promise<PullRequestDiff[]> => {
  const octokit = new Octokit({ auth: token });

  const prsResponse = await octokit.pulls.list({
    owner,
    repo,
    state: 'open',
    per_page: 5,
  });

  const prs = prsResponse.data;
  if (prs.length === 0) return [];

  const detailed = await Promise.all(
    prs.map(async pr => {
      const filesResponse = await octokit.pulls.listFiles({
        owner,
        repo,
        pull_number: pr.number,
        per_page: 20,
      });
      const files: CommitFile[] = filesResponse.data.map(f => ({
        filename: f.filename,
        patch: f.patch,
        status: f.status,
      }));
      return { number: pr.number, title: pr.title, files };
    }),
  );

  return detailed;
};

// Extensions we want to send to the AI for full-repo scans
const CODE_EXTENSIONS = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs',
  '.py', '.go', '.java', '.cs', '.cpp', '.c', '.h',
  '.rb', '.php', '.swift', '.kt', '.rs',
  '.vue', '.svelte',
  '.sh', '.bash',
]);

// Path segments that indicate generated/vendor/non-code files — skip them
const EXCLUDED_SEGMENTS = [
  'node_modules/', 'dist/', 'build/', '.next/', 'coverage/',
  '__pycache__/', '.pytest_cache/', 'vendor/', '.git/',
  '.min.js', '.min.css', '.map', '.lock',
  'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml',
];

const isCodeFile = (path: string): boolean => {
  if (EXCLUDED_SEGMENTS.some(seg => path.includes(seg))) return false;
  const ext = path.slice(path.lastIndexOf('.'));
  return CODE_EXTENSIONS.has(ext);
};

export type RepoFile = {
  path: string;
  content: string; // raw text, truncated
};

/**
 * Fetch all file paths in the repo using the Git Trees API (recursive).
 * Returns only code files, capped at maxFiles (sorted by priority extension).
 */
export const getRepoTree = async (
  owner: string,
  repo: string,
  branch: string,
  token: string,
  maxFiles = 80,
): Promise<string[]> => {
  const octokit = new Octokit({ auth: token });

  // Get the branch's HEAD commit tree SHA
  const branchData = await octokit.repos.getBranch({ owner, repo, branch });
  const treeSha = branchData.data.commit.commit.tree.sha;

  const treeResponse = await octokit.git.getTree({
    owner,
    repo,
    tree_sha: treeSha,
    recursive: '1',
  });

  const allPaths = treeResponse.data.tree
    .filter(item => item.type === 'blob' && item.path && isCodeFile(item.path))
    .map(item => item.path as string);

  // Prioritise TypeScript/JavaScript over others so we use the budget on the most likely bug sources
  const prioritised = [
    ...allPaths.filter(p => /\.(ts|tsx|js|jsx)$/.test(p)),
    ...allPaths.filter(p => !/\.(ts|tsx|js|jsx)$/.test(p)),
  ];

  return prioritised.slice(0, maxFiles);
};

/**
 * Fetch the text content of multiple files from GitHub.
 * Skips files larger than maxBytes and decodes base64.
 */
export const getFileContents = async (
  owner: string,
  repo: string,
  paths: string[],
  token: string,
  maxBytesPerFile = 12_000,
): Promise<RepoFile[]> => {
  const octokit = new Octokit({ auth: token });
  const results: RepoFile[] = [];

  // Fetch in batches of 10 to avoid hammering the API
  const BATCH = 10;
  for (let i = 0; i < paths.length; i += BATCH) {
    const batch = paths.slice(i, i + BATCH);
    const fetched = await Promise.allSettled(
      batch.map(async path => {
        const res = await octokit.repos.getContent({ owner, repo, path });
        const data = res.data as { content?: string; size?: number };
        if (!data.content || (data.size && data.size > maxBytesPerFile)) return null;
        const decoded = Buffer.from(data.content, 'base64').toString('utf8');
        return { path, content: decoded.slice(0, maxBytesPerFile) };
      }),
    );
    for (const r of fetched) {
      if (r.status === 'fulfilled' && r.value) results.push(r.value);
    }
  }

  return results;
};

export const getLatestCommitSha = async (
  owner: string,
  repo: string,
  branch: string,
  token: string,
): Promise<string | null> => {
  const octokit = new Octokit({ auth: token });
  const response = await octokit.repos.listCommits({ owner, repo, sha: branch, per_page: 1 });
  return response.data[0]?.sha ?? null;
};
