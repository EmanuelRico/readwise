const express = require('express');
const router = express.Router();
const Book = require('../models/book.model');

// GET all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET one book by ID
router.get('/:id', getBook, (req, res) => {
  res.json(res.book);
});

// POST a new book
router.post('/', async (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    description: req.body.description || '',
    image: req.body.image || '',
    rating: req.body.rating || null,
    reviews: req.body.reviews || []
  });

  try {
    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update book details (excluding reviews)
router.put('/:id', getBook, async (req, res) => {
  if (req.body.title != null) res.book.title = req.body.title;
  if (req.body.author != null) res.book.author = req.body.author;
  if (req.body.description != null) res.book.description = req.body.description;
  if (req.body.image != null) res.book.image = req.body.image;
  if (req.body.rating != null) res.book.rating = req.body.rating;

  try {
    const updatedBook = await res.book.save();
    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a book by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Book.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a review to a book
router.post('/:id/reviews', getBook, async (req, res) => {
  const newReview = {
    review: req.body.review,
    rating: req.body.rating
  };

  res.book.reviews.push(newReview);

  try {
    const updatedBook = await res.book.save();
    res.status(201).json(updatedBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a review by reviewId from a book
router.delete('/:bookId/reviews/:reviewId', getBook, async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    res.book.reviews = res.book.reviews.filter(r => r._id.toString() !== reviewId);
    await res.book.save();
    res.json(res.book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to get a book by ID (supports both :id and :bookId params)
async function getBook(req, res, next) {
  const bookId = req.params.id || req.params.bookId;
  let book;
  try {
    book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.book = book;
  next();
}

module.exports = router;
