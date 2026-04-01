const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  titleEn:       { type: String, required: true },
  titleAr:       { type: String },
  descriptionEn: { type: String },
  descriptionAr: { type: String },
  date:          { type: Date },
  locationEn:    { type: String },
  locationAr:    { type: String },
  category:      { en: String, ar: String },
  tags:          [{ type: String }],
  image:         { type: String },
  featured:      { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
