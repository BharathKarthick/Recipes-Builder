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
  getAllRecipes
} = require('../controllers/adminRecipeController');

router.post('/add',           verifyToken, adminOnly, addRecipe);
router.put('/update/:id',     verifyToken, adminOnly, updateRecipe);
router.delete('/delete/:id',  verifyToken, adminOnly, deleteRecipe);

router.put('/approve/:id',    verifyToken, adminOnly, approveRecipe);
router.put('/reject/:id',     verifyToken, adminOnly, rejectRecipe);

router.get('/pending',        verifyToken, adminOnly, getPendingRecipes);
router.get('/status-summary', verifyToken, adminOnly, getRecipeStatusSummary);
router.get('/all',            verifyToken, adminOnly, getAllRecipes);


module.exports = router;