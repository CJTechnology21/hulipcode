const express = require('express');
const checkVendor = require('../middleware/checkVendor');
const router = express.Router();
const {
  getAllCategories,
  createCategory,
  getCategoryBySlug,
  deleteCategory
} = require('../controllers/categoryController');

router.get('/', getAllCategories);
router.post('/',checkVendor, createCategory);
router.post('/:slug',checkVendor, deleteCategory);
router.get('/:slug', getCategoryBySlug);

module.exports = router;
// const express = require("express");
// const router = express.Router();
// const {
//   createCategory,
//   getAllCategories,
//   getCategoryById,
//   updateCategory,
//   deleteCategory,
// } = require("../controllers/categoryController");

// const checkVendor = require("../middleware/checkVendor");

// // POST /api/categories - Create a new category (🔒 vendor only)
// router.post("/", checkVendor, createCategory);

// // GET /api/categories - Get all categories
// router.get("/", getAllCategories);

// // GET /api/categories/:id - Get a category by ID
// router.get("/:id", getCategoryById);

// // PUT /api/categories/:id - Update a category (🔒 vendor only)
// router.put("/:id", checkVendor, updateCategory);

// // DELETE /api/categories/:id - Delete a category (🔒 vendor only)
// router.delete("/:id", checkVendor, deleteCategory);

// module.exports = router;
