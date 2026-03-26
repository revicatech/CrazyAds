const multer = require('multer');
const { cloudinary } = require('../config/cloudinary');
const streamifier = require('streamifier');

// Store files in memory — we upload to Cloudinary manually
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10 MB

// Upload a buffer to Cloudinary and return the secure URL
const uploadToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'crazy-ads' },
      (err, result) => (err ? reject(err) : resolve(result.secure_url))
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

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