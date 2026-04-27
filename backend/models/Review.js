const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment:{ type: String, trim: true, default: '' },
    imageUrl: { type: String, default: '' },
    imageId:  { type: String, default: '' },
  },
  { timestamps: true }
);

// One review per user per recipe
reviewSchema.index({ user: 1, recipe: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);