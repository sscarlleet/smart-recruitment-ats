const prisma = require('../config/prisma');

const {
  createEducationSchema,
  updateEducationSchema
} = require('../validators/education.validator');

// GET /api/profile/education
const getEducation = async (req, res) => {
  const profile = await prisma.candidateProfile.findUnique({
    where: {
      userId: req.user.id
    },
    select: {
      id: true
    }
  });

  if (!profile) {
    return res.status(404).json({
      success: false,
      message: 'Create your candidate profile first'
    });
  }

  const education = await prisma.education.findMany({
    where: {
      profileId: profile.id
    },
    orderBy: {
      startYear: 'desc'
    }
  });

  res.status(200).json({
    success: true,
    count: education.length,
    education
  });
};

// POST /api/profile/education
const addEducation = async (req, res) => {
  const validation = createEducationSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      message: 'Invalid education information',
      errors: validation.error.issues
    });
  }

  const profile = await prisma.candidateProfile.findUnique({
    where: {
      userId: req.user.id
    },
    select: {
      id: true
    }
  });

  if (!profile) {
    return res.status(404).json({
      success: false,
      message: 'Create your candidate profile first'
    });
  }

  const education = await prisma.education.create({
    data: {
      profileId: profile.id,
      ...validation.data
    }
  });

  res.status(201).json({
    success: true,
    message: 'Education added successfully',
    education
  });
};

// PUT /api/profile/education/:id
const updateEducation = async (req, res) => {
  const validation = updateEducationSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      message: 'Invalid education information',
      errors: validation.error.issues
    });
  }

  const profile = await prisma.candidateProfile.findUnique({
    where: {
      userId: req.user.id
    },
    select: {
      id: true
    }
  });

  if (!profile) {
    return res.status(404).json({
      success: false,
      message: 'Candidate profile not found'
    });
  }

  const existingEducation = await prisma.education.findFirst({
    where: {
      id: req.params.id,
      profileId: profile.id
    }
  });

  if (!existingEducation) {
    return res.status(404).json({
      success: false,
      message: 'Education record not found'
    });
  }

  const education = await prisma.education.update({
    where: {
      id: existingEducation.id
    },
    data: validation.data
  });

  res.status(200).json({
    success: true,
    message: 'Education updated successfully',
    education
  });
};

// DELETE /api/profile/education/:id
const deleteEducation = async (req, res) => {
  const profile = await prisma.candidateProfile.findUnique({
    where: {
      userId: req.user.id
    },
    select: {
      id: true
    }
  });

  if (!profile) {
    return res.status(404).json({
      success: false,
      message: 'Candidate profile not found'
    });
  }

  const existingEducation = await prisma.education.findFirst({
    where: {
      id: req.params.id,
      profileId: profile.id
    }
  });

  if (!existingEducation) {
    return res.status(404).json({
      success: false,
      message: 'Education record not found'
    });
  }

  await prisma.education.delete({
    where: {
      id: existingEducation.id
    }
  });

  res.status(200).json({
    success: true,
    message: 'Education record deleted successfully'
  });
};

module.exports = {
  getEducation,
  addEducation,
  updateEducation,
  deleteEducation
};