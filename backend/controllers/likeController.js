const Like = require('../models/Like');

// ✅ Toggle like/unlike
exports.toggleLike = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const userId = req.user.id;

    const existingLike = await Like.findOne({ recipe: recipeId, user: userId });

    if (existingLike) {
      await Like.deleteOne({ _id: existingLike._id });
      return res.json({ success: true, message: 'Unliked the recipe' });
    }

    await Like.create({ recipe: recipeId, user: userId });
    res.json({ success: true, message: 'Liked the recipe' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Public: Get like count for a recipe
exports.getLikeCount = async (req, res) => {
  try {
    const count = await Like.countDocuments({ recipe: req.params.recipeId });
    res.json({ success: true, recipeId: req.params.recipeId, likeCount: count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Admin only: Get users who liked a recipe
exports.getUsersWhoLiked = async (req, res) => {
  try {
    const likes = await Like.find({ recipe: req.params.recipeId })
      .populate('user', 'username email');
    res.json({ success: true, count: likes.length, data: likes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};