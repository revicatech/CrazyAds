const mongoose = require('mongoose');

const siteContentSchema = new mongoose.Schema({
  key:   { type: String, required: true, unique: true, index: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  group: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('SiteContent', siteContentSchema);
