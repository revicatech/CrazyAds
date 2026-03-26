const Portfolio = require('../models/Portfolio');
const { upload, cloudinary, extractPublicId } = require('../config/cloudinary');

// GET /api/portfolio
exports.getAll = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.category) filter['category.en'] = req.query.category;
    if (req.query.featured) filter.featured = req.query.featured === 'true';
    const data = await Portfolio.find(filter);
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};

// GET /api/portfolio/:id
exports.getById = async (req, res, next) => {
  try {
    const data = await Portfolio.findById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Portfolio item not found' });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// POST /api/portfolio
exports.create = [
  upload.single('image'),
  async (req, res, next) => {
    try {
      if (req.file) req.body.image = req.file.path;
      const data = await Portfolio.create(req.body);
      res.status(201).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },
];

// PUT /api/portfolio/:id
exports.update = [
  upload.single('image'),
  async (req, res, next) => {
    try {
      if (req.file) {
        const existing = await Portfolio.findById(req.params.id);
        if (existing) {
          const publicId = extractPublicId(existing.image);
          if (publicId) await cloudinary.uploader.destroy(publicId);
        }
        req.body.image = req.file.path;
      }
      const data = await Portfolio.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!data) return res.status(404).json({ success: false, message: 'Portfolio item not found' });
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },
];

// DELETE /api/portfolio/:id
exports.remove = async (req, res, next) => {
  try {
    const data = await Portfolio.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Portfolio item not found' });
    const publicId = extractPublicId(data.image);
    if (publicId) await cloudinary.uploader.destroy(publicId);
    res.json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
