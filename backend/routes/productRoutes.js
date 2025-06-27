
const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/authMiddleware')
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkCreateProducts,
} = require('../controllers/productController');

router.get('/', getAllProducts);
router.get('/:id', getProductById); 
router.post('/',protect, createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.post('/bulk', bulkCreateProducts);

module.exports = router;

// const express = require('express');
// const router = express.Router();
// const {
//   getAllProducts,
//   getProductById,
//   createProduct,
//   updateProduct,
//   deleteProduct,
//   bulkCreateProducts,
// } = require('../controllers/productController');

// router.get('/', getAllProducts);
// router.get('/product/:id', getProductById);
// router.post('/', createProduct);
// router.put('/:id', updateProduct);
// router.delete('/:id', deleteProduct);
// router.post('/bulk', bulkCreateProducts);

// module.exports = router;
