const { z } = require('zod');

const profileSchema = z.object({
  phone: z.string().trim().max(20).optional(),
  location: z.string().trim().max(150).optional(),
  headline: z.string().trim().max(150).optional(),
  summary: z.string().trim().max(2000).optional(),

  linkedinUrl: z.union([
    z.string().url(),
    z.literal('')
  ]).optional(),

  portfolioUrl: z.union([
    z.string().url(),
    z.literal('')
  ]).optional(),

  skills: z.array(
    z.string().trim().min(1).max(50)
  ).max(30).optional()
}).strict().refine(
  data => Object.keys(data).length > 0,
  {
    message: 'At least one profile field must be provided'
  }
);

module.exports = { profileSchema };