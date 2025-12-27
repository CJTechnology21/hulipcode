const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  budget: {
    type: Number,
    required: true
  },
  timeframe: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['HDB', 'Commercial', 'Condo', 'Terrace', 'Landed', 'All Property Types'],
    required: true
  },
  images: [{
    type: String, // URLs of uploaded images
    required: true
  }],
  architectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);



