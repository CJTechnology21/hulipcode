const mongoose = require('mongoose');
const Counter = require('./Counter'); // import the shared Counter model
// Counter schema to keep track of last used ID

// Lead schema
const leadSchema = new mongoose.Schema({
  id: { type: String }, // custom display ID, not unique
  // New simplified fields
  propertyDetails: { type: String, required: true },
  budget: { type: String, required: true },
  style: { type: String },
  requirements: { type: String },
  address: { type: String, required: true },
  isHuelip: { type: Boolean, default: false },
  assigned: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Client who created the lead
  // Legacy fields (optional for backward compatibility)
  name: { type: String },
  contact: { type: String },
  email: { type: String },
  status: { 
    type: String, 
    default: 'Not Assigned',
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
  category: { type: String, enum: ['RESIDENTIAL', 'COMMERCIAL','INDUSTRIAL','RETAIL'] },
  update: { type: String },
  source: { type: String },
  reminder: {
    date: { type: String },
    time: { type: String },
  },
}, { timestamps: true });

// Pre-save hook to generate display ID
leadSchema.pre('save', async function (next) {
  if (!this.id) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { name: 'leadId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.id = 'L' + String(counter.seq).padStart(6, '0'); // e.g., L000001
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

module.exports = mongoose.model('Lead', leadSchema);

// const mongoose = require('mongoose');

// const leadSchema = new mongoose.Schema({
//   id: { type: String }, // custom display ID, not unique
//   name: { type: String, required: true },
//   isHuelip: { type: Boolean, default: false },
//   budget: { type: String, required: true },
//   contact: { type: String, required: true },
//   status: { 
//     type: String, 
//     required: true,
//     enum: [
//       'Not Assigned',
//       'Assigned',
//       'Requirement Gathered',
//       'Estimate Shared',
//       'Visit Planned',
//       'Pending on Client Decision',
//       'On Hold',
//       'Not Interested',
//       'Quotation Approved'
//     ]
//   },
//   category: { type: String, enum: ['RESIDENTIAL', 'COMMERCIAL','INDUSTRIAL','INDUSTRIAL','RETAIL'] },
//   update: { type: String },
//   assigned: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   source: { type: String },
//   reminder: {
//     date: { type: String },
//     time: { type: String },
//   },
// }, { timestamps: true });

// // Pre-save hook to generate display ID for user
// leadSchema.pre('save', async function (next) {
//   if (!this.id) {
//     const count = await mongoose.model('Lead').countDocuments();
//     this.id = 'L' + String(count + 1).padStart(6, '0'); // e.g., L000001
//   }
//   next();
// });

// module.exports = mongoose.model('Lead', leadSchema);
