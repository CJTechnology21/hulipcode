const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 },
});

// Fix OverwriteModelError
const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

module.exports = Counter;
