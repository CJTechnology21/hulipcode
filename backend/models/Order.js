
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: String,
        image: String,
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        vendor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      addressLine: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      phone: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ['COD', 'Online', 'UPI', 'Card'],
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: Date,
    totalAmount: {
      type: Number,
      required: true,
    },

    // ✅ New status field added here
    status: {
      type: String,
      enum: ['Pending', 'Received', 'Packed', 'Moved', 'Delivered', 'Returned'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);
// const mongoose = require('mongoose');

// const orderSchema = new mongoose.Schema(
//   {
//     buyer: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User', // reference to the buyer
//       required: true,
//     },
//     items: [
//       {
//         product: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: 'Product',
//           required: true,
//         },
//         name: String,
//         image: String,
//         quantity: {
//           type: Number,
//           required: true,
//         },
//         price: {
//           type: Number, // chosen based on buyer role (client/architect)
//           required: true,
//         },
//         vendor: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: 'User', // the architect/vendor this product is from
//           required: true,
//         },
//       },
//     ],
//     shippingAddress: {
//       fullName: { type: String, required: true },
//       addressLine: { type: String, required: true },
//       city: { type: String, required: true },
//       state: { type: String, required: true },
//       postalCode: { type: String, required: true },
//       country: { type: String, required: true },
//       phone: { type: String, required: true },
//     },
//     paymentMethod: {
//       type: String,
//       enum: ['COD', 'Online', 'UPI', 'Card'],
//       required: true,
//     },
//     isPaid: {
//       type: Boolean,
//       default: false,
//     },
//     paidAt: Date,
//     isDelivered: {
//       type: Boolean,
//       default: false,
//     },
//     deliveredAt: Date,
//     totalAmount: {
//       type: Number,
//       required: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model('Order', orderSchema);
