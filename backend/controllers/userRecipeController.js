const Recipe = require('../models/Recipe');
const User = require('../models/User');

// @desc   User submits a recipe (stored as pending)
// @route  POST /api/recipes/user/submit
// @access Private (requires user token)
exports.addUserRecipe = async (req, res) => {
  try {
    const userId = req.user.id;

    const recipe = new Recipe({
      ...req.body,
      createdBy: userId,
      isApproved: false // Must be approved by admin
    });

    await recipe.save();

    res.status(201).json({
      message: "Recipe submitted for admin approval",
      recipe
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to submit recipe",
      error: err.message
    });
  }
};

// @desc   Get all approved recipes (public access)
// @route  GET /api/recipes/public
// @access Public
exports.getAllApprovedRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ isApproved: true });
    res.status(200).json(recipes);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch recipes",
      error: err.message
    });
  }
};

// ✅ Get user profile and approved recipe summary
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Get user basic info (excluding password)
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. Get approved recipes by this user
    const approvedRecipes = await Recipe.find({ createdBy: userId, isApproved: true }).select('name');

    res.status(200).json({
      user,
      approvedRecipes: {
        count: approvedRecipes.length,
        names: approvedRecipes.map(r => r.name)
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};