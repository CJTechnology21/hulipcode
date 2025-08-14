
const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  id: { type: String, unique: true }, 
  name: { type: String, required: true },
  isHuelip: { type: Boolean, default: false },
  budget: { type: String, required: true },
  contact: { type: String, required: true },
  status: { 
    type: String, 
    required: true,
    enum: [
      'Not Assigned',
      'Assigned',
      'Requirement Gathered',
      'Estimate Shared',
      'Visit Planned',
      'Pending on Client Decision',
      'On Hold',
      'Not Interested',
      'Quotation Approved'
    ]
  },
  category: { type: String, enum: ['RESIDENTIAL', 'COMMERCIAL'] },
  update: { type: String },
  assigned: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  source: { type: String },
  reminder: {
    date: { type: String },
    time: { type: String },
  },
}, { timestamps: true });

// Pre-save hook to generate ID
leadSchema.pre('save', async function (next) {
  if (!this.id) {
    const count = await mongoose.model('Lead').countDocuments();
    this.id = 'L' + String(count + 1).padStart(6, '0'); // e.g., L000565
  }
  next();
});

module.exports = mongoose.model('Lead', leadSchema);
