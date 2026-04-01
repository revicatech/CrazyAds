const SiteContent = require('../models/SiteContent');

// GET /api/site-content
exports.getAll = async (req, res, next) => {
  try {
    const filter = req.query.group ? { group: req.query.group } : {};
    const data = await SiteContent.find(filter);
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};

// GET /api/site-content/:key
exports.getByKey = async (req, res, next) => {
  try {
    const data = await SiteContent.findOne({ key: req.params.key });
    if (!data) return res.status(404).json({ success: false, message: 'Content not found' });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// PUT /api/site-content/:key
exports.upsert = async (req, res, next) => {
  try {
    const { value, group } = req.body;
    const data = await SiteContent.findOneAndUpdate(
      { key: req.params.key },
      { key: req.params.key, value, group },
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// PUT /api/site-content  (bulk upsert)
exports.bulkUpsert = async (req, res, next) => {
  try {
    const items = req.body;
    if (!Array.isArray(items))
      return res.status(400).json({ success: false, message: 'Expected an array' });

    const ops = items.map((item) => ({
      updateOne: {
        filter: { key: item.key },
        update: { key: item.key, value: item.value, group: item.group },
        upsert: true,
      },
    }));
    await SiteContent.bulkWrite(ops);
    const data = await SiteContent.find({ key: { $in: items.map((i) => i.key) } });
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};
