const Recipe = require("../models/Recipe");

exports.searchRecipes = async (req, res) => {
  try {
    const {
      name, ingredient,
      prepTime, prepTime_lte, prepTime_gte,
      cookTime, cookTime_lte, cookTime_gte,
      servings, servings_lte, servings_gte,
      sortBy, order
    } = req.query;

    let filter = { isApproved: true };

    if (name)       filter.name = { $regex: name, $options: "i" };
    if (ingredient) filter["ingredients.name"] = { $regex: ingredient, $options: "i" };

    if (prepTime) {
      filter.prepTime = Number(prepTime);
    } else if (prepTime_lte || prepTime_gte) {
      filter.prepTime = {};
      if (prepTime_lte) filter.prepTime.$lte = Number(prepTime_lte);
      if (prepTime_gte) filter.prepTime.$gte = Number(prepTime_gte);
    }

    if (cookTime) {
      filter.cookTime = Number(cookTime);
    } else if (cookTime_lte || cookTime_gte) {
      filter.cookTime = {};
      if (cookTime_lte) filter.cookTime.$lte = Number(cookTime_lte);
      if (cookTime_gte) filter.cookTime.$gte = Number(cookTime_gte);
    }

    if (servings) {
      filter.servings = Number(servings);
    } else if (servings_lte || servings_gte) {
      filter.servings = {};
      if (servings_lte) filter.servings.$lte = Number(servings_lte);
      if (servings_gte) filter.servings.$gte = Number(servings_gte);
    }

    let sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = order === "desc" ? -1 : 1;
    }

    const recipes = await Recipe.find(filter).sort(sortOptions);
    res.json({ success: true, count: recipes.length, data: recipes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};