const VendorToken = require("../models/VendorToken");

const storeToken = async (req, res) => {
  try {
    const { vendorId, token } = req.body;

    if (!vendorId || !token) {
      return res.status(400).json({ message: "Missing vendorId or token" });
    }

    await VendorToken.findOneAndUpdate(
      { vendorId },
      { token },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "FCM token stored successfully" });
  } catch (err) {
    console.error("Error storing FCM token:", err);
    res.status(500).json({ message: "Failed to store token" });
  }
};

module.exports = { storeToken };
