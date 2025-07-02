const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
const getAllProducts = async (req, res) => {
  try {
    const { category, subCategorySlug, subcategory, color, finish, thickness, size } = req.query;

    const filter = {};
    const andConditions = [];

    // ✅ Category
    if (category) {
      filter.category = new RegExp(`^${category}$`, "i");
    }
c
    // ✅ Subcategory
    const subCat = subCategorySlug || subcategory;
    if (subCat) {
      filter.subCategory = new RegExp(subCat, "i");
    }

    // ✅ Helper: text search in name or description
    const addTextSearch = (value) => {
      const items = value.split(",");
      const regex = new RegExp(items.join("|"), "i");
      andConditions.push({
        $or: [
          { name: regex },
          { description: regex }
        ]
      });
    };

    if (color) addTextSearch(color);
    if (finish) addTextSearch(finish);
    if (thickness) addTextSearch(thickness);
    if (size) addTextSearch(size);

    if (andConditions.length > 0) {
      filter.$and = andConditions;
    }

    const products = await Product.find(filter).sort({ createdAt: -1 }).lean();
    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Failed to fetch products" });
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
    const {
      name, description, images, price,
      category, subCategory, brand, inStock,
      countInStock, ratings, numReviews, isFeatured,
      size, thickness, finish // ✅ new optional fields
    } = req.body;

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
      subCategory,
      brand,
      inStock,
      countInStock,
      ratings,
      numReviews,
      isFeatured,
      vendor: req.user._id,
      vendorName: req.user.name,
      size,        // ✅ optional
      thickness,   // ✅ optional
      finish       // ✅ optional
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ message: 'Product created', product: savedProduct });
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ message: 'Failed to create product' });
  }
};

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

// @desc    Bulk create products
// @route   POST /api/products/bulk
const bulkCreateProducts = async (req, res) => {
  try {
    const products = req.body;

    if (!req.user || req.user.role !== 'vendor') {
      return res.status(403).json({ message: 'Only vendors can create products' });
    }

    const formattedProducts = [];

    for (const p of products) {
      if (!p.name || !p.price?.client || !p.price?.architect) {
        return res.status(400).json({ message: 'Each product must have name and both prices (client & architect)' });
      }

      formattedProducts.push({
        name: p.name,
        description: p.description || '',
        category: p.category || '',
        subCategory: p.subCategory || '',
        images: p.images || (p.img ? [p.img] : []),
        price: {
          client: p.price.client,
          architect: p.price.architect,
        },
        brand: p.brand || 'Generic',
        inStock: p.inStock !== undefined ? p.inStock : true,
        countInStock: p.countInStock || 0,
        ratings: p.ratings || 0,
        numReviews: p.numReviews || 0,
        isFeatured: p.isFeatured || false,
        vendor: req.user._id,
        vendorName: req.user.name,
        size: p.size || '',         // ✅ optional
        thickness: p.thickness || '', // ✅ optional
        finish: p.finish || '',       // ✅ optional
      });
    }

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

// const Product = require('../models/Product');

// // @desc    Get all products
// // @route   GET /api/products
// const getAllProducts = async (req, res) => {
//   try {
//     const { category, subCategorySlug, subcategory, color, finish, thickness, size } = req.query;

//     const filter = {};
//     const andConditions = [];

//     // ✅ Category
//     if (category) filter.category = category;

//     // ✅ Subcategory
//     const subCat = subCategorySlug || subcategory;
//     if (subCat) {
//       filter.subCategory = new RegExp(subCat, "i");
//     }

//     // Helper to push OR match group (name OR description contains X)
//     const addTextSearch = (fieldName, value) => {
//       const items = value.split(",");
//       const regex = new RegExp(items.join("|"), "i");
//       andConditions.push({
//         $or: [
//           { name: regex },
//           { description: regex }
//         ]
//       });
//     };

//     if (color) addTextSearch("color", color);
//     if (finish) addTextSearch("finish", finish);
//     if (thickness) addTextSearch("thickness", thickness);
//     if (size) addTextSearch("size", size);

//     if (andConditions.length > 0) {
//       filter.$and = andConditions;
//     }

//     const products = await Product.find(filter).sort({ createdAt: -1 }).lean();

//     res.status(200).json(products);
//   } catch (err) {
//     console.error("Error fetching products:", err);
//     res.status(500).json({ message: "Failed to fetch products" });
//   }
// };

// // @desc    Get single product by ID
// // @route   GET /api/products/:id
// const getProductById = async (req, res) => {

//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }
//     res.status(200).json(product);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch product' });
//   }
// };


// // @desc    Create a new product
// // @route   POST /api/products
// const createProduct = async (req, res) => {
//   try {
//     const { name, description, images, price, category, subCategory, brand, inStock, countInStock, ratings, numReviews, isFeatured } = req.body;

//     // ✅ Check if user is a vendor
//     if (!req.user || req.user.role !== 'vendor') {
//       return res.status(403).json({ message: 'Only vendors can create products' });
//     }

//     if (!name || !price?.client || !price?.architect) {
//       return res.status(400).json({ message: 'Name and both prices are required' });
//     }

//     const newProduct = new Product({
//       name,
//       description,
//       images,
//       price,
//       category,
//       subCategory,
//       brand,
//       inStock,
//       countInStock,
//       ratings,
//       numReviews,
//       isFeatured,
//       vendor: req.user._id,
//       vendorName: req.user.name,
//     });

//     const savedProduct = await newProduct.save();
//     res.status(201).json({ message: 'Product created', product: savedProduct });
//   } catch (err) {
//     console.error('Error creating product:', err);
//     res.status(500).json({ message: 'Failed to create product' });
//   }
// };

// // @desc    Update a product
// // @route   PUT /api/products/:id
// const updateProduct = async (req, res) => {
//   try {
//     const updatedProduct = await Product.findByIdAndUpdate(
//       req.params.id,
//       { $set: req.body },
//       { new: true, runValidators: true }
//     );

//     if (!updatedProduct) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     res.status(200).json(updatedProduct);
//   } catch (err) {
//     console.error('Error updating product:', err);
//     res.status(500).json({ message: 'Failed to update product' });
//   }
// };

// // @desc    Delete a product
// // @route   DELETE /api/products/:id
// const deleteProduct = async (req, res) => {
//   try {
//     const deletedProduct = await Product.findByIdAndDelete(req.params.id);

//     if (!deletedProduct) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     res.status(200).json({ message: 'Product deleted successfully' });
//   } catch (err) {
//     console.error('Error deleting product:', err);
//     res.status(500).json({ message: 'Failed to delete product' });
//   }
// };

// const bulkCreateProducts = async (req, res) => {
//   try {
//     const products = req.body;

//     // ✅ Vendor-only access
//     if (!req.user || req.user.role !== 'vendor') {
//       return res.status(403).json({ message: 'Only vendors can create products' });
//     }

//     // ✅ Validate each product
//     const formattedProducts = [];

//     for (const p of products) {
//       if (!p.name || !p.price?.client || !p.price?.architect) {
//         return res.status(400).json({ message: 'Each product must have name and both prices (client & architect)' });
//       }

//       formattedProducts.push({
//         name: p.name,
//         description: p.description || '',
//         category: p.category || '',
//         subCategory: p.subCategory || '',
//         images: p.images || (p.img ? [p.img] : []), // supports either images or img field
//         price: {
//           client: p.price.client,
//           architect: p.price.architect,
//         },
//         brand: p.brand || 'Generic',
//         inStock: p.inStock !== undefined ? p.inStock : true,
//         countInStock: p.countInStock || 0,
//         ratings: p.ratings || 0,
//         numReviews: p.numReviews || 0,
//         isFeatured: p.isFeatured || false,
//         vendor: req.user._id,
//         vendorName: req.user.name,
//       });
//     }

//     // ✅ Insert into DB
//     const savedProducts = await Product.insertMany(formattedProducts);

//     res.status(201).json({ message: 'Products added successfully', data: savedProducts });
//   } catch (err) {
//     console.error('Bulk insert error:', err);
//     res.status(500).json({ message: 'Failed to add products' });
//   }
// };


// module.exports = {
//   getAllProducts,
//   getProductById,
//   createProduct,
//   updateProduct,
//   deleteProduct,
//   bulkCreateProducts,
// };
