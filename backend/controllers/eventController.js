const Event = require('../models/Event');
const { upload, cloudinary, extractPublicId } = require('../config/cloudinary');

// GET /api/events
exports.getAll = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.category) filter['category.en'] = req.query.category;
    if (req.query.featured) filter.featured = req.query.featured === 'true';
    const data = await Event.find(filter).sort({ date: -1 });
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};

// GET /api/events/:id
exports.getById = async (req, res, next) => {
  try {
    const data = await Event.findById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// POST /api/events
exports.create = [
  upload.single('image'),
  async (req, res, next) => {
    try {
      if (req.file) req.body.image = req.file.path;
      const data = await Event.create(req.body);
      res.status(201).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },
];

// PUT /api/events/:id
exports.update = [
  upload.single('image'),
  async (req, res, next) => {
    try {
      if (req.file) {
        const existing = await Event.findById(req.params.id);
        if (existing) {
          const publicId = extractPublicId(existing.image);
          if (publicId) await cloudinary.uploader.destroy(publicId);
        }
        req.body.image = req.file.path;
      }
      const data = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!data) return res.status(404).json({ success: false, message: 'Event not found' });
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },
];

// DELETE /api/events/:id
exports.remove = async (req, res, next) => {
  try {
    const data = await Event.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Event not found' });
    const publicId = extractPublicId(data.image);
    if (publicId) await cloudinary.uploader.destroy(publicId);
    res.json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
