const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  id: { type: String }, // custom display ID, not unique
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
  category: { type: String, enum: ['RESIDENTIAL', 'COMMERCIAL','INDUSTRIAL','INDUSTRIAL','RETAIL'] },
  update: { type: String },
  assigned: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  source: { type: String },
  reminder: {
    date: { type: String },
    time: { type: String },
  },
}, { timestamps: true });

// Pre-save hook to generate display ID for user
leadSchema.pre('save', async function (next) {
  if (!this.id) {
    const count = await mongoose.model('Lead').countDocuments();
    this.id = 'L' + String(count + 1).padStart(6, '0'); // e.g., L000001
  }
  next();
});

module.exports = mongoose.model('Lead', leadSchema);
