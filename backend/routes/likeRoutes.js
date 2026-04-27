const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const adminOnly = require('../middleware/adminMiddleware');
const verifyToken = require('../middleware/authMiddleware');

router.post('/:recipeId/like',        verifyToken, likeController.toggleLike);
router.get('/:recipeId/likes/count',  likeController.getLikeCount);          // Public
router.get('/:recipeId/likes/users',  adminOnly, likeController.getUsersWhoLiked);

module.exports = router;