const Recipe = require("../models/Recipe");
const User = require('../models/User');

// ✅ Add recipe (admin)
exports.addRecipe = async (req, res) => {
  try {
    const recipe = new Recipe({
      ...req.body,
      createdBy: req.user.id,
      isApproved: true,
    });
    const saved = await recipe.save();
    res
      .status(201)
      .json({ message: "Recipe created successfully", recipe: saved });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create recipe", error: err.message });
  }
};

// ✅ Update recipe (admin)
exports.updateRecipe = async (req, res) => {
  try {
    const updated = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Recipe not found" });
    res.status(200).json({ message: "Recipe updated", recipe: updated });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update recipe", error: err.message });
  }
};

// ✅ Delete recipe (admin)
exports.deleteRecipe = async (req, res) => {
  try {
    const deleted = await Recipe.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Recipe not found" });
    res.status(200).json({ message: "Recipe deleted", recipe: deleted });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete recipe", error: err.message });
  }
};

// Approve a user-submitted recipe
exports.approveRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.json({ message: "Recipe approved", recipe });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to approve recipe", error: err.message });
  }
};

// Reject (delete) a user-submitted recipe
exports.rejectRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.json({ message: "Recipe rejected and deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to reject recipe", error: err.message });
  }
};

// Get all pending recipes (for admin review)
exports.getPendingRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ isApproved: false });
    res.json(recipes);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch pending recipes", error: err.message });
  }
};

// Get count of approved, pending, and rejected recipes
exports.getRecipeStatusSummary = async (req, res) => {
  try {
    const approvedCount = await Recipe.countDocuments({ isApproved: true });
    const pendingCount = await Recipe.countDocuments({ isApproved: false });
    const rejectedCount = await Recipe.countDocuments({ isApproved: null });

    res.json({
      approved: approvedCount,
      pending: pendingCount,
      rejected: rejectedCount,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch recipe status", error: err.message });
  }
};

// Get all pending recipes (for review)
exports.getPendingRecipes = async (req, res) => {
  try {
    const pendingRecipes = await Recipe.find({ isApproved: false }).populate(
      "createdBy",
      "username email"
    );

    res.status(200).json(pendingRecipes);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch pending recipes", error: err.message });
  }
};

// Get all registered users (excluding passwords)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // exclude password field
    res.status(200).json(users);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch users", error: err.message });
  }
};