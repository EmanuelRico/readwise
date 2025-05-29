const mongoose = require('mongoose');

// Subdocumento para cada reseña
const ReviewSchema = new mongoose.Schema({
  review: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Esquema principal para libros
const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String },  // nuevo campo para descripción
  image: { type: String },        // nuevo campo para URL de imagen
  rating: { type: Number, min: 1, max: 5 },  // nuevo campo para rating general del libro
  reviews: [ReviewSchema]
}, { timestamps: true });

module.exports = mongoose.model('Book', BookSchema);