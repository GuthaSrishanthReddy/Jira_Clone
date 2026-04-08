import Anthropic from '@anthropic-ai/sdk';
import { CustomError } from 'errors';

type GenerateIssueDraftInput = {
  prompt: string;
  projectName: string;
  projectDescription?: string | null;
  issueType: string;
  priority: string;
};

type IssueDraft = {
  title: string;
  description: string;
};

const DEFAULT_MODEL = 'claude-sonnet-4-6';

export const generateIssueDraft = async ({
  prompt,
  projectName,
  projectDescription,
  issueType,
  priority,
}: GenerateIssueDraftInput): Promise<IssueDraft> => {
  const apiKey = process.env.CLAUDE_API_KEY;

  if (!apiKey) {
    throw new CustomError(
      'GenAI is not configured. Add CLAUDE_API_KEY to api/.env to enable AI issue drafting.',
      'GEN_AI_NOT_CONFIGURED',
      503,
    );
  }

  const model = process.env.CLAUDE_MODEL || DEFAULT_MODEL;
  const client = new Anthropic({ apiKey });

  const message = await client.messages.create({
    model,
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: buildPrompt({ prompt, projectName, projectDescription, issueType, priority }),
      },
    ],
  });

  const text = message.content.find(block => block.type === 'text')?.text;

  if (!text) {
    throw new CustomError('GenAI returned an empty response.', 'GEN_AI_EMPTY_RESPONSE', 502);
  }

  const draft = parseDraft(text);

  if (!draft.title || !draft.description) {
    throw new CustomError('GenAI returned an incomplete issue draft.', 'GEN_AI_INVALID_RESPONSE', 502);
  }

  return draft;
};

const buildPrompt = ({
  prompt,
  projectName,
  projectDescription,
  issueType,
  priority,
}: GenerateIssueDraftInput) => `
You are helping a Jira-style project management app draft a new issue.

Project name: ${projectName}
Project description: ${projectDescription || 'No additional description'}
Requested issue type: ${issueType}
Requested priority: ${priority}

User prompt:
${prompt}

Return strict JSON with this exact shape:
{
  "title": "short issue summary, max 200 characters",
  "description": "<p>HTML description for a rich text editor</p>"
}

Rules:
- Title should be concise, specific, and action-oriented.
- Description must be valid simple HTML using tags like <p>, <ul>, <li>, <strong>.
- Do not wrap output in markdown or code fences.
- Keep the description practical for software/project tracking.
`;

const parseDraft = (text: string): IssueDraft => {
  const normalized = text.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/, '');
  const parsed = JSON.parse(normalized);

  return {
    title: String(parsed.title || '').trim(),
    description: String(parsed.description || '').trim(),
  };
};
