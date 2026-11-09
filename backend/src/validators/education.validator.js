const { z } = require('zod');

const currentYear = new Date().getFullYear();

const educationFields = {
  institution: z.string().trim().min(2).max(150),
  degree: z.string().trim().min(2).max(100),
  fieldOfStudy: z.string().trim().max(100).optional(),
  startYear: z.number().int().min(1950).max(currentYear + 5).optional(),
  endYear: z.number().int().min(1950).max(currentYear + 10).optional(),
  grade: z.string().trim().max(30).optional(),
  description: z.string().trim().max(1000).optional()
};

const createEducationSchema = z.object(educationFields)
  .strict()
  .refine(
    data =>
      data.startYear === undefined ||
      data.endYear === undefined ||
      data.endYear >= data.startYear,
    {
      message: 'End year cannot be earlier than start year',
      path: ['endYear']
    }
  );

const updateEducationSchema = z.object(educationFields)
  .partial()
  .strict()
  .refine(
    data => Object.keys(data).length > 0,
    { message: 'At least one field must be provided' }
  )
  .refine(
    data =>
      data.startYear === undefined ||
      data.endYear === undefined ||
      data.endYear >= data.startYear,
    {
      message: 'End year cannot be earlier than start year',
      path: ['endYear']
    }
  );

module.exports = {
  createEducationSchema,
  updateEducationSchema
};