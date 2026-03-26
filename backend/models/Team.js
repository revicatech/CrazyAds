const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  roleKey: { type: String, required: true },
  image:   { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);
