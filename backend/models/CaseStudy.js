const mongoose = require('mongoose');

const caseStudySchema = new mongoose.Schema({
  slug:            { type: String, required: true, unique: true, index: true },
  title:           { en: String, ar: String },
  tag:             { en: String, ar: String },
  category:        { en: String, ar: String },
  metrics:         [{ num: String, label: { en: String, ar: String } }],
  description:     { en: String, ar: String },
  fullDescription: { en: String, ar: String },
  challenge:       { en: String, ar: String },
  solution:        { en: String, ar: String },
  image:           { type: String, required: false },
  gallery:         [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('CaseStudy', caseStudySchema);
