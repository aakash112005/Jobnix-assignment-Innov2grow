// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// const ApiError = require('../utils/ApiError');

// const uploadDir = path.join(__dirname, '..', 'uploads');
// const resumeDir = path.join(uploadDir, 'resumes');
// const avatarDir = path.join(uploadDir, 'avatars');
// [uploadDir, resumeDir, avatarDir].forEach((dir) => {
//   if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
// });

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     if (file.fieldname === 'resume') return cb(null, resumeDir);
//     if (file.fieldname === 'avatar') return cb(null, avatarDir);
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
//     cb(null, `${req.user ? req.user._id : 'anon'}-${uniqueSuffix}${path.extname(file.originalname)}`);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   if (file.fieldname === 'resume') {
//     const allowed = ['.pdf', '.doc', '.docx'];
//     if (!allowed.includes(path.extname(file.originalname).toLowerCase())) {
//       return cb(ApiError.badRequest('Resume must be a PDF, DOC, or DOCX file'));
//     }
//   }
//   if (file.fieldname === 'avatar') {
//     if (!file.mimetype.startsWith('image/')) {
//       return cb(ApiError.badRequest('Avatar must be an image file'));
//     }
//   }
//   cb(null, true);
// };

// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
// });

// module.exports = upload;


const multer = require('multer');
const path = require('path');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const ApiError = require('../utils/ApiError');

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const userId = req.user ? req.user._id : 'anon';
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

    if (file.fieldname === 'resume') {
  const ext = path.extname(file.originalname); // e.g. ".pdf"
  return {
    folder: 'job-portal/resumes',
    resource_type: 'raw',
    allowed_formats: ['pdf', 'doc', 'docx'],
    public_id: `${userId}-${uniqueSuffix}${ext}`, // now includes the extension
  };
}

    if (file.fieldname === 'avatar') {
      return {
        folder: 'job-portal/avatars',
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        public_id: `${userId}-${uniqueSuffix}`,
      };
    }

    // fallback for any other fieldname
    return {
      folder: 'job-portal/misc',
      public_id: `${userId}-${uniqueSuffix}`,
    };
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'resume') {
    const allowed = ['.pdf', '.doc', '.docx'];
    if (!allowed.includes(path.extname(file.originalname).toLowerCase())) {
      return cb(ApiError.badRequest('Resume must be a PDF, DOC, or DOCX file'));
    }
  }
  if (file.fieldname === 'avatar') {
    if (!file.mimetype.startsWith('image/')) {
      return cb(ApiError.badRequest('Avatar must be an image file'));
    }
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = upload;