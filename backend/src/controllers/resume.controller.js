
const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

const prisma = require('../config/prisma');

const RESUME_DIRECTORY = path.join(
  __dirname,
  '../../storage/resumes'
);

const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];

// Validate the actual file content, not just its extension.
const validateFileSignature = (buffer, extension) => {
  if (!buffer || buffer.length < 4) {
    return false;
  }

  if (extension === '.pdf') {
    return buffer.subarray(0, 5).toString() === '%PDF-';
  }

  if (extension === '.doc') {
    const docSignature = Buffer.from([
      0xD0, 0xCF, 0x11, 0xE0,
      0xA1, 0xB1, 0x1A, 0xE1
    ]);

    return buffer.subarray(0, 8).equals(docSignature);
  }

  if (extension === '.docx') {
    // DOCX files are ZIP archives.
    return (
      buffer[0] === 0x50 &&
      buffer[1] === 0x4B &&
      buffer[2] === 0x03 &&
      buffer[3] === 0x04
    );
  }

  return false;
};

// Find the logged-in candidate's profile.
const getCandidateProfile = async (userId) => {
  return prisma.candidateProfile.findUnique({
    where: { userId }
  });
};

// Safely delete a file. Missing files are ignored.
const removeFileIfExists = async (filePath) => {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
};

// POST /api/profile/resume
// Upload a new resume or replace an existing one.
const uploadResume = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Please select a resume file'
    });
  }

  const profile = await getCandidateProfile(req.user.id);

  if (!profile) {
    return res.status(404).json({
      success: false,
      message: 'Create your candidate profile first'
    });
  }

  const extension = path.extname(
    req.file.originalname
  ).toLowerCase();

  if (
    !ALLOWED_EXTENSIONS.includes(extension) ||
    !validateFileSignature(req.file.buffer, extension)
  ) {
    return res.status(400).json({
      success: false,
      message: 'File content does not match an accepted document type'
    });
  }

  await fs.mkdir(RESUME_DIRECTORY, {
    recursive: true
  });

  const storedName = `${crypto.randomUUID()}${extension}`;

  const newFilePath = path.join(
    RESUME_DIRECTORY,
    storedName
  );

  const oldStoredName = profile.resumeStoredName;

  // Save the new file using a randomly generated private filename.
  await fs.writeFile(newFilePath, req.file.buffer, {
    flag: 'wx'
  });

  let updatedProfile;

  try {
    updatedProfile = await prisma.candidateProfile.update({
      where: {
        userId: req.user.id
      },
      data: {
        resumeOriginalName: path.basename(req.file.originalname),
        resumeStoredName: storedName,
        resumeMimeType: req.file.mimetype,
        resumeSize: req.file.size,
        resumeUploadedAt: new Date()
      }
    });
  } catch (error) {
    // If the database update fails, remove the newly uploaded file.
    await removeFileIfExists(newFilePath);
    throw error;
  }

  // Delete the previous resume only after the database update succeeds.
  if (oldStoredName) {
    try {
      await removeFileIfExists(
        path.join(RESUME_DIRECTORY, path.basename(oldStoredName))
      );
    } catch (cleanupError) {
      console.error(
        'Could not remove previous resume:',
        cleanupError.message
      );
    }
  }

  return res.status(200).json({
    success: true,
    message: 'Resume uploaded successfully',
    resume: {
      originalName: updatedProfile.resumeOriginalName,
      mimeType: updatedProfile.resumeMimeType,
      size: updatedProfile.resumeSize,
      uploadedAt: updatedProfile.resumeUploadedAt
    }
  });
};

// GET /api/profile/resume
// Securely download the logged-in candidate's own resume.
const downloadResume = async (req, res) => {
  const profile = await getCandidateProfile(req.user.id);

  if (!profile || !profile.resumeStoredName) {
    return res.status(404).json({
      success: false,
      message: 'No resume has been uploaded'
    });
  }

  const storedName = profile.resumeStoredName;

  // Prevent path traversal.
  if (
    path.basename(storedName) !== storedName ||
    !ALLOWED_EXTENSIONS.includes(path.extname(storedName).toLowerCase())
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
        res.status(500).json({
          success: false,
          message: 'Unable to download resume'
        });
      }
    }
  );
};

// DELETE /api/profile/resume
// Delete the logged-in candidate's own resume.
const deleteResume = async (req, res) => {
  const profile = await getCandidateProfile(req.user.id);

  if (!profile || !profile.resumeStoredName) {
    return res.status(404).json({
      success: false,
      message: 'No resume has been uploaded'
    });
  }

  const storedName = profile.resumeStoredName;

  // Prevent path traversal.
  if (
    path.basename(storedName) !== storedName ||
    !ALLOWED_EXTENSIONS.includes(path.extname(storedName).toLowerCase())
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

  // Clear database metadata first.
  await prisma.candidateProfile.update({
    where: {
      userId: req.user.id
    },
    data: {
      resumeOriginalName: null,
      resumeStoredName: null,
      resumeMimeType: null,
      resumeSize: null,
      resumeUploadedAt: null
    }
  });

  // Remove the actual file.
  try {
    await removeFileIfExists(filePath);
  } catch (error) {
    console.error(
      'Could not remove deleted resume file:',
      error.message
    );
  }

  return res.status(200).json({
    success: true,
    message: 'Resume deleted successfully'
  });
};

module.exports = {
  uploadResume,
  downloadResume,
  deleteResume
};
