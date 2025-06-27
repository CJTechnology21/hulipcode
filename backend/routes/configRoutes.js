const express = require('express');
const router = express.Router();
require('dotenv').config();

router.get('/vapid', (req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
});

module.exports = router;
