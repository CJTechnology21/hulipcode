// models/Subscription.js
const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  subscription: { type: Object, required: true },
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
