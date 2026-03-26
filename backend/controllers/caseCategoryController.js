const CaseCategory = require('../models/CaseCategory');

// GET /api/case-categories
exports.getAll = async (req, res, next) => {
  try {
    const data = await CaseCategory.find();
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};

// POST /api/case-categories
exports.create = async (req, res, next) => {
  try {
    const data = await CaseCategory.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// PUT /api/case-categories/:id
exports.update = async (req, res, next) => {
  try {
    const data = await CaseCategory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/case-categories/:id
exports.remove = async (req, res, next) => {
  try {
    const data = await CaseCategory.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
