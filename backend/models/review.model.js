const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  review: { type: String, required: true },
  rating: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Review', ReviewSchema);