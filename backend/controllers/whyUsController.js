const WhyUs = require('../models/WhyUs');

// GET /api/why-us
exports.getAll = async (req, res, next) => {
  try {
    const data = await WhyUs.find();
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};

// GET /api/why-us/:id
exports.getById = async (req, res, next) => {
  try {
    const data = await WhyUs.findById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// POST /api/why-us
exports.create = async (req, res, next) => {
  try {
    const data = await WhyUs.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// PUT /api/why-us/:id
exports.update = async (req, res, next) => {
  try {
    const data = await WhyUs.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/why-us/:id
exports.remove = async (req, res, next) => {
  try {
    const data = await WhyUs.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
