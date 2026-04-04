const multer = require('multer');
const { cloudinary } = require('../config/cloudinary');
const streamifier = require('streamifier');
const sharp = require('sharp');

// Store files in memory — we upload to Cloudinary manually
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10 MB

// Compress buffer with sharp before uploading
const compressBuffer = (buffer) =>
  sharp(buffer)
    .resize({ width: 1920, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

// Upload a buffer to Cloudinary and return the secure URL
const uploadToCloudinary = async (buffer) => {
  const compressed = await compressBuffer(buffer);
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'crazy-ads', fetch_format: 'auto', quality: 'auto' },
      (err, result) => (err ? reject(err) : resolve(result.secure_url))
    );
    streamifier.createReadStream(compressed).pipe(stream);
  });
};

// Middleware: process uploaded files and replace buffer with Cloudinary URL
const processImages = async (req, res, next) => {
  try {
    // Single image field
    if (req.file) {
      req.body.image = await uploadToCloudinary(req.file.buffer);
    }
    // Multiple fields (case study: image + gallery)
    if (req.files) {
      if (req.files.image && req.files.image[0]) {
        req.body.image = await uploadToCloudinary(req.files.image[0].buffer);
      }
      if (req.files.gallery) {
        req.body.gallery = await Promise.all(
          req.files.gallery.map((f) => uploadToCloudinary(f.buffer))
        );
      }
    }
    next();
  } catch (err) {
    next(err);
  }
};

const uploadSingle = [upload.single('image'), processImages];

const uploadCaseStudyImages = [
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'gallery', maxCount: 10 },
  ]),
  processImages,
];

module.exports = { uploadSingle, uploadCaseStudyImages };