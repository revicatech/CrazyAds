const mongoose = require('mongoose');

const portfolioCategorySchema = new mongoose.Schema({
  en: { type: String, required: true, unique: true },
  ar: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('PortfolioCategory', portfolioCategorySchema);
