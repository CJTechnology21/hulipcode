const mongoose = require('mongoose');

const portfolioProfileSchema = new mongoose.Schema({
  architectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // One profile per architect
  },
  portfolioName: {
    type: String,
    required: true,
    trim: true
  },
  completedProjects: {
    type: Number,
    default: 0,
    min: 0
  },
  description: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  socialLinks: {
    facebook: {
      type: String,
      trim: true
    },
    instagram: {
      type: String,
      trim: true
    },
    linkedin: {
      type: String,
      trim: true
    },
    twitter: {
      type: String,
      trim: true
    }
  },
  accreditations: [{
    type: String,
    trim: true
  }],
  images: [{
    type: String,
    trim: true
  }]
}, { timestamps: true });

// Validate images array length
portfolioProfileSchema.pre('save', function(next) {
  if (this.images && this.images.length > 5) {
    return next(new Error('Maximum 5 images allowed'));
  }
  next();
});

module.exports = mongoose.model('PortfolioProfile', portfolioProfileSchema);

