const mongoose = require('mongoose');

const caseStudySchema = new mongoose.Schema({
  slug:            { type: String, required: true, unique: true, index: true },
  title:           { type: String, required: true },
  tag:             { type: String },
  category:        { en: String, ar: String },
  metrics:         [{ num: String, label: String }],
  description:     { type: String },
  fullDescription: { type: String },
  challenge:       { type: String },
  solution:        { type: String },
  image:           { type: String, required: false },
  gallery:         [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('CaseStudy', caseStudySchema);
