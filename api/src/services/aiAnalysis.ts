import Anthropic from '@anthropic-ai/sdk';
import { CustomError } from 'errors';
import type { CommitInfo, PullRequestDiff, RepoFile } from './github';

export type FindingSeverity = 'critical' | 'high' | 'medium' | 'low';

export type RawFinding = {
  title: string;
  severity: FindingSeverity;
  filePath: string;
  reason: string;
  suggestedFix?: string;
  shouldCreateIssue: boolean;
};

const DEFAULT_MODEL = 'claude-sonnet-4-6';

/**
 * Build a condensed diff payload to send to the AI.
 * Truncates large patches to stay within reasonable token budgets.
 */
const buildDiffPayload = (commits: CommitInfo[], prs: PullRequestDiff[]): string => {
  const MAX_PATCH_CHARS = 800;
  const parts: string[] = [];

  for (const commit of commits) {
    parts.push(`--- Commit: ${commit.sha.slice(0, 8)} | ${commit.message.slice(0, 120)} ---`);
    for (const file of commit.files) {
      if (!file.patch) continue;
      parts.push(`File: ${file.filename} (${file.status})`);
      parts.push(file.patch.slice(0, MAX_PATCH_CHARS));
    }
  }

  for (const pr of prs) {
    parts.push(`--- PR #${pr.number}: ${pr.title} ---`);
    for (const file of pr.files) {
      if (!file.patch) continue;
      parts.push(`File: ${file.filename} (${file.status})`);
      parts.push(file.patch.slice(0, MAX_PATCH_CHARS));
    }
  }

  return parts.join('\n');
};

const buildPrompt = (diffPayload: string, projectName: string): string => `
You are a senior software engineer performing an automated code review for the project "${projectName}".

Analyze the following git diffs for potential bugs, security issues, and regressions.

Focus on:
- Risky logic changes (null dereferences, off-by-one errors, wrong conditionals)
- Security issues (missing auth checks, SQL injection, XSS, exposed secrets)
- Regression risk (changed shared utilities, removed null checks, altered API contracts)
- Missing error handling at critical paths
- Obvious performance problems (N+1 queries, large unbounded loops)

DO NOT flag:
- Style or formatting issues
- Missing comments or documentation
- Minor variable naming

Return ONLY a valid JSON array. Each element must have exactly these fields:
{
  "title": "short bug summary (max 150 chars)",
  "severity": "critical" | "high" | "medium" | "low",
  "filePath": "path/to/file.ts",
  "reason": "clear explanation of why this is a bug or risk",
  "suggestedFix": "concrete suggestion for how to fix it",
  "shouldCreateIssue": true | false
}

Rules:
- Only include real, specific findings backed by the diff content
- Set shouldCreateIssue to true only for severity "critical" or "high"
- Return an empty array [] if no real issues are found
- Do not wrap output in markdown or code fences

Diffs:
${diffPayload}
`;

/**
 * Send diffs to Claude and return structured bug findings.
 */
export const analyzeCodeDiffs = async (
  commits: CommitInfo[],
  prs: PullRequestDiff[],
  projectName: string,
): Promise<RawFinding[]> => {
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    throw new CustomError(
      'GenAI is not configured. Add CLAUDE_API_KEY to api/.env.',
      'GEN_AI_NOT_CONFIGURED',
      503,
    );
  }

  const diffPayload = buildDiffPayload(commits, prs);
  if (!diffPayload.trim()) return [];

  const model = process.env.CLAUDE_MODEL || DEFAULT_MODEL;
  const client = new Anthropic({ apiKey });

  const message = await client.messages.create({
    model,
    max_tokens: 4096,
    messages: [{ role: 'user', content: buildPrompt(diffPayload, projectName) }],
  });

  const text = message.content.find(block => block.type === 'text')?.text ?? '';

  if (!text.trim()) return [];

  return parseFindings(text);
};

// ─── Full-repo file analysis ───────────────────────────────────────────────

const buildFullScanPrompt = (fileChunk: RepoFile[], projectName: string): string => `
You are a senior software engineer performing a full codebase audit for the project "${projectName}".

Analyze the following source files for bugs, security vulnerabilities, and high-risk code patterns.

Focus on:
- Null/undefined dereferences that will crash at runtime
- Security issues (missing auth, injection risks, exposed credentials, insecure defaults)
- Logic errors (wrong conditions, missing edge cases, incorrect comparisons)
- Missing error handling at I/O boundaries (network, DB, file system)
- Dangerous patterns (eval, prototype pollution, path traversal, unvalidated input)

DO NOT flag:
- Code style or formatting
- Missing documentation or comments
- Minor naming issues
- TODOs or placeholder code

Return ONLY a valid JSON array. Each element must have exactly these fields:
{
  "title": "short bug summary (max 150 chars)",
  "severity": "critical" | "high" | "medium" | "low",
  "filePath": "path/to/file.ts",
  "reason": "specific explanation referencing the actual code",
  "suggestedFix": "concrete fix",
  "shouldCreateIssue": true | false
}

Rules:
- Only flag real, specific issues you can see in the code — no guesses
- Set shouldCreateIssue to true only for "critical" or "high"
- Return [] if no real issues are found
- Do not wrap in markdown or code fences

Files:
${fileChunk.map(f => `=== ${f.path} ===\n${f.content}`).join('\n\n')}
`;

const CHUNK_SIZE = 8; // files per AI call — keeps token usage manageable

/**
 * Analyze full file contents in chunks and aggregate findings.
 * Each chunk of CHUNK_SIZE files gets its own AI call.
 */
export const analyzeFileContents = async (
  files: RepoFile[],
  projectName: string,
): Promise<RawFinding[]> => {
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    throw new CustomError(
      'GenAI is not configured. Add CLAUDE_API_KEY to api/.env.',
      'GEN_AI_NOT_CONFIGURED',
      503,
    );
  }

  if (files.length === 0) return [];

  const model = process.env.CLAUDE_MODEL || DEFAULT_MODEL;
  const client = new Anthropic({ apiKey });
  const allFindings: RawFinding[] = [];

  for (let i = 0; i < files.length; i += CHUNK_SIZE) {
    const chunk = files.slice(i, i + CHUNK_SIZE);

    const message = await client.messages.create({
      model,
      max_tokens: 4096,
      messages: [{ role: 'user', content: buildFullScanPrompt(chunk, projectName) }],
    });

    const text = message.content.find(block => block.type === 'text')?.text ?? '';

    if (text.trim()) {
      allFindings.push(...parseFindings(text));
    }
  }

  return allFindings;
};

// ─── Shared parser ──────────────────────────────────────────────────────────

const VALID_SEVERITIES: FindingSeverity[] = ['critical', 'high', 'medium', 'low'];

const parseFindings = (text: string): RawFinding[] => {
  const normalized = text
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/, '');

  const parsed = JSON.parse(normalized);
  if (!Array.isArray(parsed)) return [];

  return parsed
    .filter(
      (item): item is RawFinding =>
        typeof item.title === 'string' &&
        VALID_SEVERITIES.includes(item.severity) &&
        typeof item.filePath === 'string' &&
        typeof item.reason === 'string',
    )
    .map(item => ({
      title: String(item.title).slice(0, 150),
      severity: item.severity as FindingSeverity,
      filePath: String(item.filePath),
      reason: String(item.reason),
      suggestedFix: item.suggestedFix ? String(item.suggestedFix) : undefined,
      shouldCreateIssue: Boolean(item.shouldCreateIssue),
    }));
};
