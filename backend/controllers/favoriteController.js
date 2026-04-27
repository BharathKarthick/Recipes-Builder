const Favorite = require("../models/Favorite");

// ✅ Toggle favorite (add/remove)
exports.toggleFavorite = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const userId = req.user.id;

    const existingFavorite = await Favorite.findOne({ recipe: recipeId, user: userId });

    if (existingFavorite) {
      await Favorite.deleteOne({ _id: existingFavorite._id });
      return res.json({ success: true, message: "Removed from favorites" });
    }

    await Favorite.create({ recipe: recipeId, user: userId });
    res.json({ success: true, message: "Added to favorites" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get user's own favorites
exports.getMyFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id }).populate("recipe");
    res.json({ success: true, count: favorites.length, data: favorites });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Admin only: Get users who favorited a recipe
exports.getUsersWhoFavorited = async (req, res) => {
  try {
    const favorites = await Favorite.find({ recipe: req.params.recipeId })
      .populate("user", "username email");
    res.json({ success: true, data: favorites });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};