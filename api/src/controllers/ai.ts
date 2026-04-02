import { catchErrors, BadUserInputError, EntityNotFoundError } from 'errors';
import prisma from 'database/prisma';
import { generateIssueDraft } from 'utils/genAi';

export const createIssueDraft = catchErrors(async (req, res) => {
  const prompt = String(req.body.prompt || '').trim();
  const issueType = String(req.body.issueType || '').trim();
  const priority = String(req.body.priority || '').trim();

  if (!prompt) {
    throw new BadUserInputError({ fields: { prompt: 'This field is required' } });
  }

  const project = await prisma.project.findUnique({
    where: { id: req.currentUser.projectId },
  });

  if (!project) {
    throw new EntityNotFoundError('Project');
  }

  const draft = await generateIssueDraft({
    prompt,
    projectName: project.name,
    projectDescription: project.description,
    issueType,
    priority,
  });

  res.respond({ draft });
});
