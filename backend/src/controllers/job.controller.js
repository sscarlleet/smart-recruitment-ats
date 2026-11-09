
const prisma = require('../config/prisma');
const {
  createJobSchema,
  updateJobSchema
} = require('../validators/job.validator');

// Helper: pagination values
const getPagination = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(query.limit, 10) || 10));

  return { page, limit, skip: (page - 1) * limit };
};

// HR/Admin: Create a job
const createJob = async (req, res, next) => {
  try {
    const validation = createJobSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid job details',
        errors: validation.error.issues
      });
    }

    const job = await prisma.job.create({
      data: {
        ...validation.data,
        createdById: req.user.id
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Job created successfully',
      job
    });
  } catch (error) {
    next(error);
  }
};

// Public: List published jobs
const getPublishedJobs = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const search = String(req.query.search || '').trim();

    const where = {
      status: 'PUBLISHED',
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { department: { contains: search, mode: 'insensitive' } },
          { location: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.job.count({ where })
    ]);

    return res.status(200).json({
      success: true,
      jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Public: View one published job
const getPublishedJobById = async (req, res, next) => {
  try {
    const job = await prisma.job.findFirst({
      where: {
        id: req.params.id,
        status: 'PUBLISHED'
      }
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    return res.status(200).json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

// HR/Admin: List all jobs, including drafts and closed jobs
const getManageableJobs = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        include: {
          createdBy: {
            select: { id: true, name: true, email: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.job.count()
    ]);

    return res.status(200).json({
      success: true,
      jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// HR/Admin: Update job details
const updateJob = async (req, res, next) => {
  try {
    const validation = updateJobSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid job details',
        errors: validation.error.issues
      });
    }

    const existingJob = await prisma.job.findUnique({
      where: { id: req.params.id }
    });

    if (!existingJob) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (existingJob.status === 'ARCHIVED') {
      return res.status(400).json({
        success: false,
        message: 'Archived jobs cannot be edited'
      });
    }

    const job = await prisma.job.update({
      where: { id: req.params.id },
      data: validation.data
    });

    return res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      job
    });
  } catch (error) {
    next(error);
  }
};

// HR/Admin: Publish a draft or reopen a closed job
const publishJob = async (req, res, next) => {
  try {
    const existingJob = await prisma.job.findUnique({
      where: { id: req.params.id }
    });

    if (!existingJob) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (existingJob.status === 'ARCHIVED') {
      return res.status(400).json({
        success: false,
        message: 'Archived jobs cannot be published'
      });
    }

    if (existingJob.status === 'PUBLISHED') {
      return res.status(400).json({
        success: false,
        message: 'Job is already published'
      });
    }

    const job = await prisma.job.update({
      where: { id: req.params.id },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date()
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Job published successfully',
      job
    });
  } catch (error) {
    next(error);
  }
};

// HR/Admin: Close a published job
const closeJob = async (req, res, next) => {
  try {
    const existingJob = await prisma.job.findUnique({
      where: { id: req.params.id }
    });

    if (!existingJob) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (existingJob.status !== 'PUBLISHED') {
      return res.status(400).json({
        success: false,
        message: 'Only published jobs can be closed'
      });
    }

    const job = await prisma.job.update({
      where: { id: req.params.id },
      data: { status: 'CLOSED' }
    });

    return res.status(200).json({
      success: true,
      message: 'Job closed successfully',
      job
    });
  } catch (error) {
    next(error);
  }
};

// HR/Admin: Archive a job that is not currently published
const archiveJob = async (req, res, next) => {
  try {
    const existingJob = await prisma.job.findUnique({
      where: { id: req.params.id }
    });

    if (!existingJob) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (existingJob.status === 'PUBLISHED') {
      return res.status(400).json({
        success: false,
        message: 'Close the job before archiving it'
      });
    }

    if (existingJob.status === 'ARCHIVED') {
      return res.status(400).json({
        success: false,
        message: 'Job is already archived'
      });
    }

    const job = await prisma.job.update({
      where: { id: req.params.id },
      data: { status: 'ARCHIVED' }
    });

    return res.status(200).json({
      success: true,
      message: 'Job archived successfully',
      job
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createJob,
  getPublishedJobs,
  getPublishedJobById,
  getManageableJobs,
  updateJob,
  publishJob,
  closeJob,
  archiveJob
};
