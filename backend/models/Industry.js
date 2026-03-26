const mongoose = require('mongoose');

const industrySchema = new mongoose.Schema({
  name:         { type: String, required: true },
  nameAr:       { type: String },
  headlineEn:   { type: String },
  headlineEmEn: { type: String },
  colorIndex:   { type: Number, default: 0 },
  descEn:       { type: String },
  descAr:       { type: String },
  services:     [{ type: String }],
  image:        { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Industry', industrySchema);
