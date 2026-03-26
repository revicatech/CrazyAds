const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  num:      { type: String, required: true },
  en:       { type: String, required: true },
  ar:       { type: String },
  descEn:   { type: String },
  descAr:   { type: String },
  features: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
