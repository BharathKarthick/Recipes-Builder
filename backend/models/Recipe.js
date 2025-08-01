const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: String,
  amount: Number,
  unit: String,
  category: String
}, { _id: false });

const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  image: String,
  category: String,
  ingredients: [ingredientSchema],
  instructions: [String],
  prepTime: Number,
  cookTime: Number,
  servings: Number,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isApproved: { type: Boolean, default: true } // Admin-created are auto-approved
}, { timestamps: true });

module.exports = mongoose.model('Recipe', recipeSchema);