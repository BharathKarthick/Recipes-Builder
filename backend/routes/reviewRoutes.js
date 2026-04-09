const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const verifyToken = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadReviewImage');

router.get('/:recipeId',               reviewController.getReviewsForRecipe);
router.post('/:recipeId',              verifyToken, upload.single('image'), reviewController.addReview);
router.put('/:reviewId',               verifyToken, upload.single('image'), reviewController.updateReview);
router.delete('/:reviewId',            verifyToken, reviewController.deleteOwnReview);
router.delete('/:reviewId/admin',      verifyToken, adminOnly, reviewController.adminDeleteReview);
router.get('/:recipeId/users',         verifyToken, adminOnly, reviewController.getUsersWhoReviewed);

module.exports = router;