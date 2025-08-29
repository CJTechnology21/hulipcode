const mongoose = require('mongoose');

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
    match: /^\S+@\S+\.\S+$/, // Basic email regex
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['architect', 'vendor', 'client', 'admin', 'Site Staff', 'Labour Contractor', 'Subcon'],
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
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);