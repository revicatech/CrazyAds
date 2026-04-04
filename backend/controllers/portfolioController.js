const Portfolio = require('../models/Portfolio');
const { cloudinary, extractPublicId } = require('../config/cloudinary');

/* ─── Slug helpers ─────────────────────────────────────────────────── */
function toSlug(str) {
  return (str || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function uniqueSlug(base, excludeId = null) {
  let slug = base;
  let n = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const query = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    const exists = await Portfolio.findOne(query);
    if (!exists) return slug;
    slug = `${base}-${n++}`;
  }
}

/* ─── GET /api/portfolio ───────────────────────────────────────────── */
exports.getAll = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.category) filter['category.en'] = req.query.category;
    if (req.query.featured) filter.featured = req.query.featured === 'true';
    const data = await Portfolio.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};

/* ─── GET /api/portfolio/slug/:slug ────────────────────────────────── */
exports.getBySlug = async (req, res, next) => {
  try {
    const data = await Portfolio.findOne({ slug: req.params.slug });
    if (!data) return res.status(404).json({ success: false, message: 'Portfolio item not found' });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

/* ─── GET /api/portfolio/:id ───────────────────────────────────────── */
exports.getById = async (req, res, next) => {
  try {
    const data = await Portfolio.findById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Portfolio item not found' });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

/* ─── POST /api/portfolio ──────────────────────────────────────────── */
// Receives plain JSON (frontend pre-uploads images to Cloudinary).
// express.json() middleware (already on the app) parses req.body directly.
exports.create = async (req, res, next) => {
  try {
    const body = { ...req.body };
    console.log('PORTFOLIO CREATE body:', JSON.stringify(body, null, 2));

    // Auto-generate slug from titleEn if not supplied
    if (!body.slug && body.titleEn) {
      body.slug = await uniqueSlug(toSlug(body.titleEn));
    }

    const data = await Portfolio.create(body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

/* ─── PUT /api/portfolio/:id ───────────────────────────────────────── */
exports.update = async (req, res, next) => {
  try {
    const existing = await Portfolio.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Portfolio item not found' });

    const body = { ...req.body };
    console.log('PORTFOLIO UPDATE body:', JSON.stringify(body, null, 2));

    // Slug: keep existing if none supplied; generate if item never had one
    if (!body.slug) {
      body.slug = existing.slug || await uniqueSlug(
        toSlug(body.titleEn || existing.titleEn),
        req.params.id
      );
    }

    // If the cover image was replaced, clean up the old Cloudinary asset
    if (body.image && body.image !== existing.image) {
      const publicId = extractPublicId(existing.image);
      if (publicId) await cloudinary.uploader.destroy(publicId).catch(() => {});
    }

    const data = await Portfolio.findByIdAndUpdate(
      req.params.id,
      body,
      { new: true, runValidators: false }
    );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

/* ─── DELETE /api/portfolio/:id ────────────────────────────────────── */
exports.remove = async (req, res, next) => {
  try {
    const data = await Portfolio.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Portfolio item not found' });
    const publicId = extractPublicId(data.image);
    if (publicId) await cloudinary.uploader.destroy(publicId).catch(() => {});
    res.json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
