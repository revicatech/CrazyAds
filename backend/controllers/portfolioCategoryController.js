const PortfolioCategory = require('../models/PortfolioCategory');

// GET /api/portfolio-categories
exports.getAll = async (req, res, next) => {
  try {
    const data = await PortfolioCategory.find();
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};

// POST /api/portfolio-categories
exports.create = async (req, res, next) => {
  try {
    const data = await PortfolioCategory.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// PUT /api/portfolio-categories/:id
exports.update = async (req, res, next) => {
  try {
    const data = await PortfolioCategory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/portfolio-categories/:id
exports.remove = async (req, res, next) => {
  try {
    const data = await PortfolioCategory.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
