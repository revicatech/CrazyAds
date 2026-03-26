const Industry = require('../models/Industry');
const { upload, cloudinary, extractPublicId } = require('../config/cloudinary');

// GET /api/industries
exports.getAll = async (req, res, next) => {
  try {
    const data = await Industry.find();
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};

// GET /api/industries/:id
exports.getById = async (req, res, next) => {
  try {
    const data = await Industry.findById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Industry not found' });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// POST /api/industries
exports.create = [
  upload.single('image'),
  async (req, res, next) => {
    try {
      if (req.file) req.body.image = req.file.path;
      const data = await Industry.create(req.body);
      res.status(201).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },
];

// PUT /api/industries/:id
exports.update = [
  upload.single('image'),
  async (req, res, next) => {
    try {
      if (req.file) {
        const existing = await Industry.findById(req.params.id);
        if (existing) {
          const publicId = extractPublicId(existing.image);
          if (publicId) await cloudinary.uploader.destroy(publicId);
        }
        req.body.image = req.file.path;
      }
      const data = await Industry.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!data) return res.status(404).json({ success: false, message: 'Industry not found' });
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },
];

// DELETE /api/industries/:id
exports.remove = async (req, res, next) => {
  try {
    const data = await Industry.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Industry not found' });
    const publicId = extractPublicId(data.image);
    if (publicId) await cloudinary.uploader.destroy(publicId);
    res.json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
