const mongoose = require("mongoose");

const shortlistSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  professionalId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  portfolioProfileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PortfolioProfile",
    required: true
  }
}, { timestamps: true });

// Ensure one user can only shortlist a professional once
shortlistSchema.index({ userId: 1, professionalId: 1 }, { unique: true });

module.exports = mongoose.model("Shortlist", shortlistSchema);



