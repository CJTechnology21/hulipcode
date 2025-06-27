const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
const getAllProducts = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
const getProductById = async (req, res) => {

  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch product' });
  }
};


// @desc    Create a new product
// @route   POST /api/products
const createProduct = async (req, res) => {
  try {
    const { name, description, images, price, category, brand, inStock, countInStock, ratings, numReviews, isFeatured } = req.body;

    // ✅ Check if user is a vendor
    if (!req.user || req.user.role !== 'vendor') {
      return res.status(403).json({ message: 'Only vendors can create products' });
    }

    if (!name || !price?.client || !price?.architect) {
      return res.status(400).json({ message: 'Name and both prices are required' });
    }

    const newProduct = new Product({
      name,
      description,
      images,
      price,
      category,
      brand,
      inStock,
      countInStock,
      ratings,
      numReviews,
      isFeatured,
      vendor: req.user._id ,
      vendorName:req.user.name,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ message: 'Product created', product: savedProduct });
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ message: 'Failed to create product' });
  }
};

// const createProduct = async (req, res) => {
//   try {
//     const { name, description, images, price, category } = req.body;

//     if (!name || !price || !price.client || !price.architect) {
//       return res.status(400).json({ message: 'Name and both prices are required' });
//     }

//     const newProduct = new Product({
//       name,
//       description,
//       images,
//       price,
//       category,
//     });

//     const savedProduct = await newProduct.save();
//     res.status(201).json(savedProduct);
//     console.log('Product created:', savedProduct);
//   } catch (err) {
//     console.error('Error creating product:', err);
//     res.status(500).json({ message: 'Failed to create product' });
//   }
// };


// @desc    Update a product
// @route   PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ message: 'Failed to update product' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ message: 'Failed to delete product' });
  }
};

const bulkCreateProducts = async (req, res) => {
  try {
    const products = req.body;

    const formattedProducts = products.map((p) => {
      return {
        name: p.name,
        description: p.description,
        category: p.category,
        images: [p.img],
        price: {
          client: p.price.client,
          architect: p.price.architect,
        },
        // Optional fields if they exist in schema
        brand: p.brand || 'Generic',
        inStock: p.inStock !== undefined ? p.inStock : true,
        countInStock: p.countInStock || 0,
        ratings: p.ratings || 0,
        numReviews: p.numReviews || 0,
        isFeatured: p.isFeatured || false,
      };
    });

    const savedProducts = await Product.insertMany(formattedProducts);
    res.status(201).json({ message: 'Products added successfully', data: savedProducts });
  } catch (err) {
    console.error('Bulk insert error:', err);
    res.status(500).json({ message: 'Failed to add products' });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkCreateProducts,
};
