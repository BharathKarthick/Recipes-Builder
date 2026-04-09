const Recipe = require("../models/Recipe");
const User = require('../models/User');
const RejectedLog = require("../models/RejectedLog");
const sendEmail = require("../utils/sendEmail");

// ✅ Add recipe (admin — auto-approved)
exports.addRecipe = async (req, res) => {
  try {
    const recipe = new Recipe({
      ...req.body,
      createdBy: req.user.id,
      isApproved: true, // Admin-added recipes are immediately live
    });
    const saved = await recipe.save();
    res.status(201).json({ message: "Recipe created successfully", recipe: saved });
  } catch (err) {
    res.status(500).json({ message: "Failed to create recipe", error: err.message });
  }
};

// ✅ Update recipe (admin)
exports.updateRecipe = async (req, res) => {
  try {
    const updated = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Recipe not found" });
    res.status(200).json({ message: "Recipe updated", recipe: updated });
  } catch (err) {
    res.status(500).json({ message: "Failed to update recipe", error: err.message });
  }
};

// ✅ Delete recipe (admin)
exports.deleteRecipe = async (req, res) => {
  try {
    const deleted = await Recipe.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Recipe not found" });
    res.status(200).json({ message: "Recipe deleted", recipe: deleted });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete recipe", error: err.message });
  }
};

// ✅ Approve a user-submitted recipe
exports.approveRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    const user = await User.findById(recipe.createdBy);
    if (user && user.email) {
      try {
        await sendEmail(
          user.email,
          "Recipe Accepted — Recipe Builder",
          `<p>Hello ${user.username},</p>
           <p>Your recipe "<b>${recipe.name}</b> has been approved and is now live!</p>
           <p>— Recipe Builder Support</p>`
        );
      } catch (emailError) {
        console.error("Email send failed after recipe approval:", emailError);
      }
    }

    res.json({ message: "Recipe approved", recipe });
  } catch (err) {
    res.status(500).json({ message: "Failed to approve recipe", error: err.message });
  }
};

// ✅ Reject a user-submitted recipe
exports.rejectRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    // FIX #2: Prevent rejecting an already-approved recipe by mistake
    if (recipe.isApproved) {
      return res.status(400).json({ message: "Cannot reject an already approved recipe. Use delete instead." });
    }

    // Get submitter info before deleting
    const user = await User.findById(recipe.createdBy);

    // FIX (RejectedLog improvement): Store submitter username in log for full audit trail
    await RejectedLog.create({
      recipeId:    recipe._id,
      name:        recipe.name,
      submittedBy: user ? user.username : 'unknown',
      rejectedBy:  req.user.id,
    });

    // Send rejection email to submitter
    if (user && user.email) {
      try {
        await sendEmail(
          user.email,
          "Recipe Rejected — Recipe Builder",
          `<p>Hello ${user.username},</p>
           <p>Your recipe "<b>${recipe.name}</b>" was not approved at this time.</p>
           <p>Please review our guidelines and feel free to resubmit.</p>
           <p>— Recipe Builder Support</p>`
        );
      } catch (emailError) {
        console.error("Email send failed after recipe rejection:", emailError);
      }
    }

    await Recipe.findByIdAndDelete(recipe._id);
    res.json({ message: "Recipe rejected, log saved, and deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to reject recipe", error: err.message });
  }
};

// ✅ Get all pending recipes (admin review queue)
exports.getPendingRecipes = async (req, res) => {
  try {
    const pendingRecipes = await Recipe.find({ isApproved: false })
      .populate("createdBy", "username email");
    res.status(200).json(pendingRecipes);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch pending recipes", error: err.message });
  }
};

// ✅ Get count of approved, pending, and rejected recipes
exports.getRecipeStatusSummary = async (req, res) => {
  try {
    const approvedCount = await Recipe.countDocuments({ isApproved: true });
    const pendingCount  = await Recipe.countDocuments({ isApproved: false });
    const rejectedCount = await RejectedLog.countDocuments();

    res.json({ approved: approvedCount, pending: pendingCount, rejected: rejectedCount });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch recipe status", error: err.message });
  }
};

// ✅ Get all recipes (admin — approved + pending)
exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().populate('createdBy', 'username email');
    res.status(200).json(recipes);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch all recipes", error: err.message });
  }
};