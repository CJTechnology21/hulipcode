const express = require("express");
const router = express.Router();
const { storeToken } = require("../controllers/vendorTokenController"); // adjust path

router.post("/store-token", storeToken);

module.exports = router;
