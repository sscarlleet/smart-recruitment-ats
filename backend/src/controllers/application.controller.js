
const fs = require('fs/promises');
const path = require('path');

const prisma = require('../config/prisma');

const {
  applySchema,
  updateApplicationStatusSchema
} = require('../validators/application.validator');

const RESUME_DIRECTORY = path.join(
  __dirname,
  '../../storage/resumes'
);

// HR can access only applications for jobs they created.
// ADMIN can access all applications.
const getApplicationAccessWhere = (user, applicationId) => {
  if (user.role === 'HR') {
    return {
      id: applicationId,
      job: {
        is: {
          createdById: user.id
        }
      }
    };
  }

  return {
    id: applicationId
  };
};

// Candidate applies for a published job
const applyForJob = async (req, res, next) => {
  try {
    const validation = applySchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid application data',
        errors: validation.error.issues
      });
    }

    const job = await prisma.job.findUnique({
      where: { id: req.params.jobId }
    });

    if (!job || job.status !== 'PUBLISHED') {
      return res.status(404).json({
        success: false,
        message: 'Published job not found'
      });
    }

    const existingApplication = await prisma.application.findUnique({
      where: {
        candidateId_jobId: {
          candidateId: req.user.id,
          jobId: job.id
        }
      }
    });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    const application = await prisma.$transaction(async (tx) => {
      const created = await tx.application.create({
        data: {
          candidateId: req.user.id,
          jobId: job.id,
          coverLetter: validation.data.coverLetter,
          status: 'APPLIED'
        }
      });

      await tx.applicationStatusHistory.create({
        data: {
          applicationId: created.id,
          changedById: req.user.id,
          fromStatus: null,
          toStatus: 'APPLIED',
          note: 'Application submitted'
        }
      });

      return created;
    });

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    next(error);
  }
};

// Candidate views their own applications
const getMyApplications = async (req, res, next) => {
  try {
    const applications = await prisma.application.findMany({
      where: {
        candidateId: req.user.id
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            department: true,
            location: true,
            employmentType: true,
            status: true
          }
        },
        statusHistory: {
          orderBy: {
            createdAt: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    next(error);
  }
};

// HR sees applications for their own jobs.
// ADMIN sees all applications.
const getAllApplications = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);

    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || 10, 1),
      50
    );

    const where = {};

    if (req.user.role === 'HR') {
      where.job = {
        is: {
          createdById: req.user.id
        }
      };
    }

    if (req.query.status) {
      const validStatuses = [
        'APPLIED',
        'SCREENING',
        'INTERVIEW',
        'SELECTED',
        'OFFERED',
        'REJECTED',
        'WITHDRAWN'
      ];

      if (!validStatuses.includes(req.query.status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid application status'
        });
      }

      where.status = req.query.status;
    }

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        include: {
          candidate: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          job: {
            select: {
              id: true,
              title: true,
              department: true,
              location: true,
              createdById: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
      }),

      prisma.application.count({ where })
    ]);

    return res.status(200).json({
      success: true,
      applications,
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

// HR/Admin views one application and the candidate's profile.
const getApplicationById = async (req, res, next) => {
  try {
    const application = await prisma.application.findFirst({
      where: getApplicationAccessWhere(req.user, req.params.id),

      include: {
        candidate: {
          select: {
            id: true,
            name: true,
            email: true,

            candidateProfile: {
              select: {
                id: true,
                phone: true,
                location: true,
                headline: true,
                summary: true,
                linkedinUrl: true,
                portfolioUrl: true,
                skills: true,
                resumeOriginalName: true,
                resumeMimeType: true,
                resumeSize: true,
                resumeUploadedAt: true,

                education: {
                  orderBy: {
                    createdAt: 'desc'
                  }
                }
              }
            }
          }
        },

        job: true,

        statusHistory: {
          include: {
            changedBy: {
              select: {
                id: true,
                name: true,
                role: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found or you do not have access'
      });
    }

    return res.status(200).json({
      success: true,
      application
    });
  } catch (error) {
    next(error);
  }
};

// HR/Admin downloads a candidate's resume through an application.
const downloadApplicationResume = async (req, res, next) => {
  try {
    const application = await prisma.application.findFirst({
      where: getApplicationAccessWhere(req.user, req.params.id),

      select: {
        id: true,

        candidate: {
          select: {
            candidateProfile: {
              select: {
                resumeStoredName: true,
                resumeOriginalName: true
              }
            }
          }
        }
      }
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found or you do not have access'
      });
    }

    const profile = application.candidate.candidateProfile;

    if (!profile || !profile.resumeStoredName) {
      return res.status(404).json({
        success: false,
        message: 'Candidate has not uploaded a resume'
      });
    }

    const storedName = profile.resumeStoredName;

    const allowedExtensions = ['.pdf', '.doc', '.docx'];

    if (
      path.basename(storedName) !== storedName ||
      !allowedExtensions.includes(
        path.extname(storedName).toLowerCase()
      )
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid resume file reference'
      });
    }

    const filePath = path.join(
      RESUME_DIRECTORY,
      storedName
    );

    try {
      await fs.access(filePath);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return res.status(404).json({
          success: false,
          message: 'Resume file not found'
        });
      }

      throw error;
    }

    return res.download(
      filePath,
      path.basename(profile.resumeOriginalName || 'resume'),
      (error) => {
        if (error && !res.headersSent) {
          next(error);
        }
      }
    );
  } catch (error) {
    next(error);
  }
};

// HR/Admin updates application status.
// HR can update applications for their own jobs only.
const updateApplicationStatus = async (req, res, next) => {
  try {
    const validation = updateApplicationStatusSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status update',
        errors: validation.error.issues
      });
    }

    const { status, note } = validation.data;

    const application = await prisma.application.findFirst({
      where: getApplicationAccessWhere(req.user, req.params.id)
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found or you do not have access'
      });
    }

    const allowedTransitions = {
      APPLIED: ['SCREENING', 'REJECTED'],
      SCREENING: ['INTERVIEW', 'REJECTED'],
      INTERVIEW: ['SELECTED', 'REJECTED'],
      SELECTED: ['OFFERED', 'REJECTED'],
      OFFERED: [],
      REJECTED: [],
      WITHDRAWN: []
    };

    if (!allowedTransitions[application.status].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change application status from ${application.status} to ${status}`
      });
    }

    const updatedApplication = await prisma.$transaction(async (tx) => {
      const updated = await tx.application.update({
        where: {
          id: application.id
        },
        data: {
          status
        }
      });

      await tx.applicationStatusHistory.create({
        data: {
          applicationId: application.id,
          changedById: req.user.id,
          fromStatus: application.status,
          toStatus: status,
          note
        }
      });

      return updated;
    });

    return res.status(200).json({
      success: true,
      message: 'Application status updated successfully',
      application: updatedApplication
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
  getAllApplications,
  getApplicationById,
  downloadApplicationResume,
  updateApplicationStatus
};
