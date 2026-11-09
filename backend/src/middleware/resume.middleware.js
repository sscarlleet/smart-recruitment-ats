const multer = require('multer');

const allowedTypes = {
  '.pdf': ['application/pdf'],
  '.doc': ['application/msword'],
  '.docx': [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/zip'
  ]
};

const storage = multer.memoryStorage();

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1
  },

  fileFilter: (req, file, cb) => {
    const extension = require('path')
      .extname(file.originalname)
      .toLowerCase();

    const acceptedMimeTypes = allowedTypes[extension];

    if (!acceptedMimeTypes || !acceptedMimeTypes.includes(file.mimetype)) {
      return cb(
        new Error('Only PDF, DOC and DOCX files are allowed')
      );
    }

    cb(null, true);
  }
});

const handleResumeUpload = (req, res, next) => {
  upload.single('resume')(req, res, error => {
    if (error) {
      if (error instanceof multer.MulterError) {
        const message = error.code === 'LIMIT_FILE_SIZE'
          ? 'Resume must not exceed 5 MB'
          : 'Invalid file upload';

        return res.status(400).json({
          success: false,
          message
        });
      }

      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    next();
  });
};

module.exports = { handleResumeUpload };