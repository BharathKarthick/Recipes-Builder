const express = require("express");
const router = express.Router();
const { searchRecipes } = require("../controllers/searchController");

router.get("/", searchRecipes);

module.exports = router;