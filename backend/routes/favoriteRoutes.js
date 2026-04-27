const express = require("express");
const router = express.Router();
const favoriteController = require("../controllers/favoriteController");
const adminOnly = require("../middleware/adminMiddleware");
const verifyToken = require("../middleware/authMiddleware");

router.post("/:recipeId/favorite",        verifyToken, favoriteController.toggleFavorite);
router.get("/my-favorites",               verifyToken, favoriteController.getMyFavorites);
router.get("/:recipeId/favorites/users",  adminOnly,   favoriteController.getUsersWhoFavorited);

module.exports = router;