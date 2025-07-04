const mongoose = require("mongoose");

const VendorTokenSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("VendorToken", VendorTokenSchema);
