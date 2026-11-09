const prisma = require('../config/prisma');
const { profileSchema } = require('../validators/profile.validator');

// GET /api/profile
const getMyProfile = async (req, res) => {
  const profile = await prisma.candidateProfile.findUnique({
    where: {
      userId: req.user.id
    },
    include: {
      education: {
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  });

  if (!profile) {
    return res.status(200).json({
      success: true,
      profile: null
    });
  }

  const {
    resumeStoredName,
    ...safeProfile
  } = profile;

  res.status(200).json({
    success: true,
    profile: safeProfile
  });
};

// PUT /api/profile
const updateMyProfile = async (req, res) => {
  const validation = profileSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      message: 'Invalid profile information',
      errors: validation.error.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message
      }))
    });
  }

  const profileData = validation.data;

  const profile = await prisma.candidateProfile.upsert({
    where: {
      userId: req.user.id
    },

    create: {
      userId: req.user.id,
      ...profileData
    },

    update: profileData,

    include: {
      education: true
    }
  });

  res.status(200).json({
    success: true,
    message: 'Candidate profile saved successfully',
    profile
  });
};

module.exports = {
  getMyProfile,
  updateMyProfile
};