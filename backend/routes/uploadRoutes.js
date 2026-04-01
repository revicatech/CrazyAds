const router = require('express').Router();
const { cloudinary } = require('../config/cloudinary');
const { protect } = require('../middleware/auth');

// GET /api/upload/sign
// Returns a signed params object so the frontend can upload directly to Cloudinary
router.get('/sign', protect, (req, res) => {
  const timestamp = Math.round(Date.now() / 1000);
  const params = { timestamp, folder: 'crazy-ads' };
  const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET);
  res.json({
    timestamp,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    folder: 'crazy-ads',
  });
});

module.exports = router;
