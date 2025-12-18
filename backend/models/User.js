const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  address: { type: String, trim: true },
  gst: { type: String, trim: true },
  addressLine1: { type: String, trim: true },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  zip: { type: String, trim: true },
  country: { type: String, trim: true },
}, { _id: true });

const bankDetailsSchema = new mongoose.Schema({
  accountHolderName: { type: String, trim: true },
  accountNumber: { type: String, trim: true },
  ifscCode: { type: String, trim: true },
  bankName: { type: String, trim: true },
  bankAddress: { type: String, trim: true },
  ibanNumber: { type: String, trim: true },
  upiNumber: { type: String, trim: true },
}, { _id: true });
const openingBalanceSchema = new mongoose.Schema({
  mode: {
    type: String,
    enum: ["pay", "receive"], 
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
}, { _id: true });
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    match: /^[0-9]{10,15}$/,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    match: /^\S+@\S+\.\S+$/, 
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: [
      'architect',
      'vendor',
      'client',
      'admin',
      'Site Staff',
      'Labour Contractor',
      'Subcon',
      'Material Supplier',
      'Service Provider',
    ],
    default: 'client',
  },
  isSuperAdmin: {
    type: Boolean,
    default: false,
  },
  rewardPoints: {
    type: Number,
    default: 0,
  },

  // New fields
  addresses: {
    type: [addressSchema],
    default: [],
  },
  bankDetails: {
    type: [bankDetailsSchema],
    default: [],
  },
  openingBalance: {
    type: openingBalanceSchema,
    default: null,
  },

  // Aadhaar & PAN
  aadhaarFile: {
    type: String,
    trim: true,
  },
  panFile: {
    type: String,
    trim: true,
  },
  // KYC Status
  kycStatus: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'NOT_SUBMITTED'],
    default: 'NOT_SUBMITTED',
  },
  kycApprovedAt: {
    type: Date,
  },
  kycApprovedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  kycRejectedAt: {
    type: Date,
  },
  kycRejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  kycRejectedReason: {
    type: String,
  },
  kycNotes: {
    type: String,
  },


}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   phoneNumber: {
//     type: String,
//     match: /^[0-9]{10,15}$/,
//     unique: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     lowercase: true,
//     unique: true,
//     match: /^\S+@\S+\.\S+$/, // Basic email regex
//   },
//   password: {
//     type: String,
//     required: true,
//     minlength: 6,
//   },
//   role: {
//     type: String,
//     enum: ['architect', 'vendor', 'client', 'admin', 'Site Staff', 'Labour Contractor', 'Subcon', 'Material Supplier', 'Service Provider'],
//     default: 'client',
//   },
//   isSuperAdmin: {
//     type: Boolean,
//     default: false,
//   },
//   rewardPoints: {
//     type: Number,
//     default: 0,
//   },
// }, { timestamps: true });

// module.exports = mongoose.model('User', userSchema);