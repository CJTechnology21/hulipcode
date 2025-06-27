const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    match: /^[0-9]{10,15}$/, // Basic validation for international numbers
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
    enum: ['architect', 'vendor', 'client', 'admin'],
    default: 'client',
  },
  isSuperAdmin: {
    type: Boolean,
    default: false, // Only one user can be true
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);