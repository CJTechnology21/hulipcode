// routes/photoRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { addProjectPhoto, generateUploadURL, getProjectPhotos, uploadLocal } = require("../controllers/photoController");

// Configure multer for local file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Route to generate upload URL (S3 or local)
router.post("/generate-upload-url", generateUploadURL);

// Route for local file upload (fallback)
router.post("/upload-local", upload.single("file"), uploadLocal);

// Route to add a photo to a project
router.post("/add-photo", addProjectPhoto);
router.get("/", getProjectPhotos);

module.exports = router;
