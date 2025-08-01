const express = require('express');
const router = express.Router();
const {
  addUserRecipe,
  getAllApprovedRecipes,
  getUserProfile // ✅ Add this import
} = require('../controllers/userRecipeController');
const verifyToken = require('../middleware/authMiddleware');

// ✅ User submits a recipe (pending approval)
router.post('/submit', verifyToken, addUserRecipe);

// ✅ Public: get all approved recipes
router.get('/recipes', getAllApprovedRecipes);

// ✅ Get user profile and approved recipe summary
router.get('/profile', verifyToken, getUserProfile);

module.exports = router;