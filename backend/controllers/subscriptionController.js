const Subscription = require('../models/Subscription');

// @desc    Save or update push subscription for vendor
// @route   POST /api/subscribe
// @access  Private (Vendor)
const saveSubscription = async (req, res) => {
  try {
    const { subscription } = req.body;

    if (!subscription) {
      return res.status(400).json({ message: 'Subscription data missing' });
    }

    await Subscription.findOneAndUpdate(
      { vendorId: req.user._id },
      { subscription },
      { upsert: true, new: true }
    );

    res.status(201).json({ message: 'Subscription saved' });
  } catch (err) {
    console.error('Subscription save error:', err);
    res.status(500).json({ message: 'Failed to save subscription' });
  }
};

module.exports = {
  saveSubscription,
};
