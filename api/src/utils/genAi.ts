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

const DEFAULT_MODEL = 'gemini-2.0-flash';

export const generateIssueDraft = async ({
  prompt,
  projectName,
  projectDescription,
  issueType,
  priority,
}: GenerateIssueDraftInput): Promise<IssueDraft> => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new CustomError(
      'GenAI is not configured. Add GEMINI_API_KEY to api/.env to enable AI issue drafting.',
      'GEN_AI_NOT_CONFIGURED',
      503,
    );
  }

  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        generationConfig: {
          temperature: 0.6,
          responseMimeType: 'application/json',
        },
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: buildPrompt({
                  prompt,
                  projectName,
                  projectDescription,
                  issueType,
                  priority,
                }),
              },
            ],
          },
        ],
      }),
    },
  );

  const payload: any = await response.json();

  if (!response.ok) {
    throw new CustomError(
      payload?.error?.message || 'GenAI request failed.',
      'GEN_AI_REQUEST_FAILED',
      response.status,
    );
  }

  const text = payload?.candidates?.[0]?.content?.parts?.find((part: { text?: string }) => part.text)
    ?.text;

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
