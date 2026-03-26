const { v2: cloudinary } = require('cloudinary');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'crazy-ads',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
  },
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const extractPublicId = (url) => {
  if (!url) return null;
  const parts = url.split('/');
  const uploadIndex = parts.indexOf('upload');
  if (uploadIndex === -1) return null;
  // Skip version segment (v1234567890)
  const start = parts[uploadIndex + 1].startsWith('v') ? uploadIndex + 2 : uploadIndex + 1;
  const pathWithExt = parts.slice(start).join('/');
  return pathWithExt.replace(/\.[^/.]+$/, '');
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images allowed'));
    }
  },
});

module.exports = { cloudinary, extractPublicId, upload };
