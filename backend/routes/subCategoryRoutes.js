const express = require('express');
const router = express.Router();
const checkVendor = require('../middleware/checkVendor');
const {
  createSubcategory,
  getSubcategoriesByCategory,
  deleteSubcategory
} = require('../controllers/subcategoryController');

router.post('/', checkVendor, createSubcategory);
router.get('/:category', getSubcategoriesByCategory);

module.exports = router;
