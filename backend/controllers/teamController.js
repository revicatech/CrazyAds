const Team = require('../models/Team');
const { upload, cloudinary, extractPublicId } = require('../config/cloudinary');

// GET /api/team
exports.getAll = async (req, res, next) => {
  try {
    const data = await Team.find();
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};

// GET /api/team/:id
exports.getById = async (req, res, next) => {
  try {
    const data = await Team.findById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Team member not found' });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// POST /api/team
exports.create = [
  upload.single('image'),
  async (req, res, next) => {
    try {
      if (req.file) req.body.image = req.file.path;
      const data = await Team.create(req.body);
      res.status(201).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },
];

// PUT /api/team/:id
exports.update = [
  upload.single('image'),
  async (req, res, next) => {
    try {
      if (req.file) {
        const existing = await Team.findById(req.params.id);
        if (existing) {
          const publicId = extractPublicId(existing.image);
          if (publicId) await cloudinary.uploader.destroy(publicId);
        }
        req.body.image = req.file.path;
      }
      const data = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!data) return res.status(404).json({ success: false, message: 'Team member not found' });
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },
];

// DELETE /api/team/:id
exports.remove = async (req, res, next) => {
  try {
    const data = await Team.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Team member not found' });
    const publicId = extractPublicId(data.image);
    if (publicId) await cloudinary.uploader.destroy(publicId);
    res.json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
