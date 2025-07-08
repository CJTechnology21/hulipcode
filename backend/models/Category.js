const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Auto-generate slug from name
categorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
  }
  next();
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;

// // models/Category.js
// const mongoose = require("mongoose");

// const subcategorySchema = new mongoose.Schema({
//   name: String,
//   image: String, // optional
// });

// const categoryGroupSchema = new mongoose.Schema({
//   groupName: String, // e.g. "Shop by Colour", "Cabinet Finishes"
//   subcategories: [subcategorySchema],
// });

// const categorySchema = new mongoose.Schema({
//   name: { type: String, required: true, unique: true }, // e.g. "Laminates"
//   groups: [categoryGroupSchema], // groups with subcategories
// });

// module.exports = mongoose.model("Category", categorySchema);
