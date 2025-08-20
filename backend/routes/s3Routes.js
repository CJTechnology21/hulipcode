const express = require("express");
const { generateUploadURL } = require('../controllers/s3Controller')

const router = express.Router();

// POST /api/s3-presigned-url
router.post("/s3-presigned-url", generateUploadURL);

module.exports = router;