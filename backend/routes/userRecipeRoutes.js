const express = require('express');
const router = express.Router();
const {
  addUserRecipe,
  getAllApprovedRecipes,
  getUserProfile,
  getMySubmittedRecipes
} = require('../controllers/userRecipeController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/submit',    verifyToken, addUserRecipe);
router.get('/recipes',    getAllApprovedRecipes);
router.get('/profile',    verifyToken, getUserProfile);
router.get('/my-recipes', verifyToken, getMySubmittedRecipes);

module.exports = router;