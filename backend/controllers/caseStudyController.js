const CaseStudy = require('../models/CaseStudy');
const { upload, cloudinary, extractPublicId } = require('../config/cloudinary');

const uploadFields = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'gallery', maxCount: 10 },
]);

// GET /api/case-studies
exports.getAll = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.category) filter['category.en'] = req.query.category;
    const data = await CaseStudy.find(filter);
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};

// GET /api/case-studies/:slug
exports.getBySlug = async (req, res, next) => {
  try {
    const data = await CaseStudy.findOne({ slug: req.params.slug });
    if (!data) return res.status(404).json({ success: false, message: 'Case study not found' });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// POST /api/case-studies
exports.create = [
  uploadFields,
  async (req, res, next) => {
    try {
      if (req.files?.image?.[0]) req.body.image = req.files.image[0].path;
      if (req.files?.gallery) req.body.gallery = req.files.gallery.map((f) => f.path);
      const data = await CaseStudy.create(req.body);
      res.status(201).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },
];

// PUT /api/case-studies/:id
exports.update = [
  uploadFields,
  async (req, res, next) => {
    try {
      const existing = await CaseStudy.findById(req.params.id);
      if (!existing) return res.status(404).json({ success: false, message: 'Case study not found' });

      if (req.files?.image?.[0]) {
        const publicId = extractPublicId(existing.image);
        if (publicId) await cloudinary.uploader.destroy(publicId);
        req.body.image = req.files.image[0].path;
      }
      if (req.files?.gallery) {
        req.body.gallery = [...(existing.gallery || []), ...req.files.gallery.map((f) => f.path)];
      }

      const data = await CaseStudy.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },
];

// DELETE /api/case-studies/:id
exports.remove = async (req, res, next) => {
  try {
    const data = await CaseStudy.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Case study not found' });

    const publicId = extractPublicId(data.image);
    if (publicId) await cloudinary.uploader.destroy(publicId);
    for (const url of data.gallery || []) {
      const gId = extractPublicId(url);
      if (gId) await cloudinary.uploader.destroy(gId);
    }

    res.json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
