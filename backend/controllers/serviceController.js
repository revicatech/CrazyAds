const Service = require('../models/Service');

// GET /api/services
exports.getAll = async (req, res, next) => {
  try {
    const data = await Service.find();
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};

// GET /api/services/:id
exports.getById = async (req, res, next) => {
  try {
    const data = await Service.findById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// POST /api/services
exports.create = async (req, res, next) => {
  try {
    const data = await Service.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// PUT /api/services/:id
exports.update = async (req, res, next) => {
  try {
    const data = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!data) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/services/:id
exports.remove = async (req, res, next) => {
  try {
    const data = await Service.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
