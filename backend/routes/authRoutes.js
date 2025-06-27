const express = require('express');
const { registerUser, loginUser,googleAuth,googleDetails } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/google', googleAuth);
router.post('/google/details', googleDetails);

module.exports = router;
