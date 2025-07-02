const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    minlength: [10, 'Description must be at least 10 characters long'],
  },
  price: {
    client: {
      type: Number,
      required: [true, 'Client price is required'],
      min: [0, 'Price cannot be negative'],
    },
    architect: {
      type: Number,
      required: [true, 'Architect price is required'],
      min: [0, 'Price cannot be negative'],
    },
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
  },
  subCategory: {
    type: String,
    required: [true, 'Subcategory is required'], 
    trim: true,
    lowercase: true,
  },
  brand: {
    type: String,
    default: 'Generic',
    trim: true,
  },
  images: {
    type: [String],
    validate: [arr => arr.length > 0, 'At least one image is required'],
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  countInStock: {
    type: Number,
    default: 0,
    min: [0, 'Stock count cannot be negative'],
  },
  ratings: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  numReviews: {
    type: Number,
    default: 0,
    min: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true, 
  },
  vendorName: {
    type: String,
    required: true,
    trim: true,
  },

  // ✅ New Fields
  size: {
    type: String,
    trim: true, // Accepts anything like '120cm x 240cm', '4ft x 8ft', '2.4m x 1.2m', etc.
  },
  thickness: {
    type: String,
    trim: true, // e.g. '0.8 mm', '1 mm', etc.
  },
  finish: {
    type: String,
    trim: true, // e.g. 'Matte', 'Glossy', etc.
  },

}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);
// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Product name is required'],
//     trim: true,
//     minlength: [2, 'Name must be at least 2 characters long'],
//   },
//   description: {
//     type: String,
//     required: [true, 'Product description is required'],
//     minlength: [10, 'Description must be at least 10 characters long'],
//   },
//   price: {
//     client: {
//       type: Number,
//       required: [true, 'Client price is required'],
//       min: [0, 'Price cannot be negative'],
//     },
//     architect: {
//       type: Number,
//       required: [true, 'Architect price is required'],
//       min: [0, 'Price cannot be negative'],
//     },
//   },
//   category: {
//     type: String,
//     required: [true, 'Category is required'],
//     trim: true,
//   },
//    subCategory: {
//     type: String,
//     required: [true, 'Subcategory is required'], 
//     trim: true,
//     lowecase:true,
//   },
//   brand: {
//     type: String,
//     default: 'Generic',
//     trim: true,
//   },
//   images: {
//     type: [String],
//     validate: [arr => arr.length > 0, 'At least one image is required'],
//   },
//   inStock: {
//     type: Boolean,
//     default: true,
//   },
//   countInStock: {
//     type: Number,
//     default: 0,
//     min: [0, 'Stock count cannot be negative'],
//   },
//   ratings: {
//     type: Number,
//     default: 0,
//     min: 0,
//     max: 5,
//   },
//   numReviews: {
//     type: Number,
//     default: 0,
//     min: 0,
//   },
//   isFeatured: {
//     type: Boolean,
//     default: false,
//   },
//   vendor: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User', 
//     required: true, 
//   },
//   vendorName: {
//   type: String,
//   required: true,
//   trim: true,
// },
// }, {
//   timestamps: true,
// });

// module.exports = mongoose.model('Product', productSchema);
