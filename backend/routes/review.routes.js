const express = require('express');
const router = express.Router();
const Review = require('../models/review.model');

// Get all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one review by id
router.get('/:id', getReview, (req, res) => {
  res.json(res.review);
});

// Create new review
router.post('/', async (req, res) => {
  const review = new Review({
    title: req.body.title,
    author: req.body.author,
    review: req.body.review,
    rating: req.body.rating
  });

  try {
    const newReview = await review.save();
    res.status(201).json(newReview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update review by id
router.put('/:id', getReview, async (req, res) => {
  if (req.body.title != null) res.review.title = req.body.title;
  if (req.body.author != null) res.review.author = req.body.author;
  if (req.body.review != null) res.review.review = req.body.review;
  if (req.body.rating != null) res.review.rating = req.body.rating;

  try {
    const updatedReview = await res.review.save();
    res.json(updatedReview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete review by id sin middleware getReview
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Review.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.json({ message: 'Deleted Review' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware para obtener review por id
async function getReview(req, res, next) {
  let review;
  try {
    review = await Review.findById(req.params.id);
    if (review == null) {
      return res.status(404).json({ message: 'Review not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.review = review;
  next();
}

module.exports = router;
