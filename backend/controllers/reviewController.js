const Review = require('../models/Review');
const { cloudinary } = require('../utils/cloudinary');

// ✅ Public: get reviews for a recipe (newest first)
exports.getReviewsForRecipe = async (req, res) => {
  try {
    const reviews = await Review.find({ recipe: req.params.recipeId })
      .populate('user', 'username fullName')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reviews', error: err.message });
  }
};

// ✅ User: add review (rating required), optional image
exports.addReview = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const userId = req.user.id;
    let { rating, comment } = req.body;

    rating = Number(rating);
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const exists = await Review.findOne({ user: userId, recipe: recipeId });
    if (exists) {
      return res.status(409).json({ message: 'You already reviewed this recipe. Use update instead.' });
    }

    let imageUrl = '';
    let imageId  = '';
    if (req.file) {
      imageUrl = req.file.path;
      imageId  = req.file.filename;
    }

    const review = await Review.create({
      user: userId, recipe: recipeId, rating,
      comment: comment || '', imageUrl, imageId,
    });

    const populated = await review.populate('user', 'username fullName');
    res.status(201).json({ message: 'Review added', review: populated });
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(409).json({ message: 'You already reviewed this recipe.' });
    }
    res.status(500).json({ message: 'Failed to add review', error: err.message || err });
  }
};

// ✅ User: update own review
exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;
    let { rating, comment } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.user.toString() !== userId) return res.status(403).json({ message: 'Not allowed' });

    if (rating !== undefined) {
      rating = Number(rating);
      if (rating < 1 || rating > 5)
        return res.status(400).json({ message: 'Rating must be between 1 and 5' });
      review.rating = rating;
    }
    if (comment !== undefined) review.comment = comment;

    if (req.file) {
      if (review.imageId) {
        try { await cloudinary.uploader.destroy(review.imageId); } catch (e) {}
      }
      review.imageUrl = req.file.path;
      review.imageId  = req.file.filename;
    }

    await review.save();
    const populated = await review.populate('user', 'username fullName');
    res.json({ message: 'Review updated', review: populated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update review', error: err.message });
  }
};

// ✅ User: delete own review (also deletes cloud image)
exports.deleteOwnReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.user.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not allowed' });

    if (review.imageId) {
      try { await cloudinary.uploader.destroy(review.imageId); } catch (e) {}
    }
    await Review.deleteOne({ _id: req.params.reviewId });
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete review', error: err.message });
  }
};

// ✅ Admin: delete any review
exports.adminDeleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (review.imageId) {
      try { await cloudinary.uploader.destroy(review.imageId); } catch (e) {}
    }
    await Review.deleteOne({ _id: req.params.reviewId });
    res.json({ message: 'Review deleted by admin' });
  } catch (err) {
    res.status(500).json({ message: 'Admin failed to delete review', error: err.message });
  }
};

// ✅ Admin: list users who reviewed a recipe
exports.getUsersWhoReviewed = async (req, res) => {
  try {
    const reviews = await Review.find({ recipe: req.params.recipeId })
      .populate('user', 'username email fullName')
      .select('user rating createdAt');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reviewers', error: err.message });
  }
};