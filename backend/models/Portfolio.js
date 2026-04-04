const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  slug:           { type: String, unique: true, sparse: true, index: true },

  // Bilingual title
  titleEn:        { type: String, required: true },
  titleAr:        { type: String },

  // Bilingual short description (shown in cards / detail hero)
  descriptionEn:  { type: String, required: true },
  descriptionAr:  { type: String, required: true },

  // Bilingual long body text (shown on detail page)
  bodyEn:         { type: String, required: true },
  bodyAr:         { type: String, required: true },

  // Category — matches PortfolioCategory values
  category:       { en: { type: String }, ar: { type: String } },

  // Client name
  client:         { en: { type: String }, ar: { type: String } },

  // Year the project was delivered
  year:           { type: Number },

  // Services provided for this project (e.g. "Branding", "Social Media")
  services:       [{ type: String }],

  // Tags (used as filter badges in the UI)
  tags:           [{ type: String }],

  // Cover / thumbnail image
  image:          { type: String },

  // Additional project images
  gallery:        [{ type: String }],

  // Optional external link (live site, Behance, etc.)
  url:            { type: String },

  // Pin to top of portfolio grid
  featured:       { type: Boolean, default: false },

  // Manual sort order (lower = first)
  order:          { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);
