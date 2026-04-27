const Recipe = require('../models/Recipe');
const User = require('../models/User');

// ✅ User submits a recipe (stored as pending, awaiting admin approval)
exports.addUserRecipe = async (req, res) => {
  try {
    const recipe = new Recipe({
      ...req.body,
      createdBy: req.user.id,
      isApproved: false // Always false for user submissions
    });
    await recipe.save();
    res.status(201).json({ message: "Recipe submitted for admin approval", recipe });
  } catch (err) {
    res.status(500).json({ message: "Failed to submit recipe", error: err.message });
  }
};

// ✅ Get all approved recipes (public) — FIX #7: Added pagination
exports.getAllApprovedRecipes = async (req, res) => {
  try {
    // page=1&limit=20 by default — prevents huge payloads with thousands of recipes
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip  = (page - 1) * limit;

    const total   = await Recipe.countDocuments({ isApproved: true });
    const recipes = await Recipe.find({ isApproved: true })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      recipes
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch recipes", error: err.message });
  }
};

// ✅ Get user profile + their submitted recipes summary
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });

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

// ✅ Get all recipes submitted by the logged-in user (approved + pending)
exports.getMySubmittedRecipes = async (req, res) => {
  try {
    const myRecipes = await Recipe.find({ createdBy: req.user.id });
    res.status(200).json({ count: myRecipes.length, recipes: myRecipes });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch your submitted recipes", error: err.message });
  }
};