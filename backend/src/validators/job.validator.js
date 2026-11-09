
const { z } = require('zod');

const jobFields = {
  title: z.string().trim().min(3).max(100),
  department: z.string().trim().min(2).max(80),
  location: z.string().trim().min(2).max(100),
  description: z.string().trim().min(20).max(10000),

  employmentType: z.enum([
    'FULL_TIME',
    'PART_TIME',
    'CONTRACT',
    'INTERNSHIP'
  ]),

  salaryMin: z.number().int().nonnegative().optional(),
  salaryMax: z.number().int().nonnegative().optional()
};

const createJobSchema = z.object(jobFields).refine(
  (data) =>
    data.salaryMin === undefined ||
    data.salaryMax === undefined ||
    data.salaryMin <= data.salaryMax,
  {
    message: 'Minimum salary cannot exceed maximum salary',
    path: ['salaryMax']
  }
);

const updateJobSchema = z.object(jobFields)
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: 'At least one field must be provided'
    }
  )
  .refine(
    (data) =>
      data.salaryMin === undefined ||
      data.salaryMax === undefined ||
      data.salaryMin <= data.salaryMax,
    {
      message: 'Minimum salary cannot exceed maximum salary',
      path: ['salaryMax']
    }
  );

module.exports = {
  createJobSchema,
  updateJobSchema
};
