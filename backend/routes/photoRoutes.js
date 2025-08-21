// routes/projectRoutes.js
const express = require("express");
const router = express.Router();
const { addProjectPhoto,generateUploadURL,getProjectPhotos } = require("../controllers/photoController");

// Route to add a photo to a project
router.post("/generate-upload-url", generateUploadURL);
router.post("/add-photo", addProjectPhoto);
router.get("/", getProjectPhotos);

module.exports = router;
