const express = require('express');
const router = express.Router();
const adminOnly = require('../middleware/adminMiddleware');
const verifyToken = require('../middleware/authMiddleware');
const {
  addRecipe,
  updateRecipe,
  deleteRecipe,
  approveRecipe,
  rejectRecipe,
  getPendingRecipes,
  getRecipeStatusSummary,
  getAllUsers // ✅ Imported properly
} = require('../controllers/adminRecipeController');

// Admin routes (protected)
router.post('/add', verifyToken, adminOnly, addRecipe);
router.put('/update/:id', verifyToken, adminOnly, updateRecipe);
router.delete('/delete/:id', verifyToken, adminOnly, deleteRecipe);

// ✅ Approval / Rejection
router.put('/recipe/approve/:id', verifyToken, adminOnly, approveRecipe);
router.put('/recipe/reject/:id', verifyToken, adminOnly, rejectRecipe);

// ✅ View pending
router.get('/pending', verifyToken, adminOnly, getPendingRecipes);

// ✅ Status summary
router.get('/status-summary', verifyToken, adminOnly, getRecipeStatusSummary);

// ✅ Get all users
router.get('/users', verifyToken, adminOnly, getAllUsers);

module.exports = router;