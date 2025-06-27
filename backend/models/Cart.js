const mongoose = require('mongoose')
const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      _id: mongoose.Schema.Types.ObjectId,
      name: String,
      image: String,
      price: Number,
      quantity: Number,
      vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Cart", cartSchema);

// // models/Cart.js
// const mongoose = require('mongoose');

// const cartSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true }, // FIXED
//   items: [
//     {
//       _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // Optional: If you're storing actual product IDs
//       name: String,
//       price: Number,
//       quantity: Number,
//       image: String,

//     },
//   ],
// });

// module.exports = mongoose.model("Cart", cartSchema);

// // // models/Cart.js
// // const mongoose = require('mongoose')

// // const cartSchema = new mongoose.Schema({
// //   userId: { type: String, required: true },
// //   items: [
// //     {
// //       _id: String, // product ID
// //       name: String,
// //       price: Number,
// //       quantity: Number,
// //       image: String,
// //     },
// //   ],
// // });

// // module.exports = mongoose.model("Cart", cartSchema);

