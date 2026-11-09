
const { z } = require('zod');

const applySchema = z.object({
  coverLetter: z
    .string()
    .trim()
    .max(3000, 'Cover letter cannot exceed 3000 characters')
    .optional()
});

const updateApplicationStatusSchema = z.object({
  status: z.enum([
    'SCREENING',
    'INTERVIEW',
    'SELECTED',
    'OFFERED',
    'REJECTED'
  ]),
  note: z
    .string()
    .trim()
    .max(1000, 'Note cannot exceed 1000 characters')
    .optional()
});

module.exports = {
  applySchema,
  updateApplicationStatusSchema
};
