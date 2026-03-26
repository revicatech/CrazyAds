const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  titleEn:  { type: String, required: true },
  titleAr:  { type: String },
  category: { en: String, ar: String },
  tags:     [{ type: String }],
  image:    { type: String },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);
