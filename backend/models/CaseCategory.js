const mongoose = require('mongoose');

const caseCategorySchema = new mongoose.Schema({
  en: { type: String, required: true, unique: true },
  ar: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('CaseCategory', caseCategorySchema);
