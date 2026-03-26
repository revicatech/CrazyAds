const mongoose = require('mongoose');

const whyUsSchema = new mongoose.Schema({
  eyebrowEn: { type: String },
  headingEn: { type: String },
  bodyAr:    { type: String },
  bodyEn:    { type: String },
  tag:       { type: String },
  bg:        { type: String },
  accent:    { type: String },
  textColor: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('WhyUs', whyUsSchema);
