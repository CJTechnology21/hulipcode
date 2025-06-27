const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { saveSubscription } = require('../controllers/subscriptionController');

router.post('/', protect, saveSubscription);

module.exports = router;
