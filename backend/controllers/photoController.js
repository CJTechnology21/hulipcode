const AWS = require("aws-sdk");
const Photo = require("../models/Photo");
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Initialize S3 only if AWS credentials are provided
let s3 = null;
let useLocalStorage = false;

if (process.env.AWS_REGION && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  try {
    s3 = new AWS.S3({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      signatureVersion: "v4",
    });
    console.log("✅ AWS S3 client initialized (photoController)");
  } catch (error) {
    console.warn("⚠️  AWS S3 initialization failed:", error.message);
    useLocalStorage = true;
  }
} else {
  console.warn("⚠️  AWS S3 not configured. Using local file storage as fallback.");
  useLocalStorage = true;
}

// Create uploads directory if using local storage
if (useLocalStorage) {
  const uploadsDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log("✅ Created local uploads directory:", uploadsDir);
  }
}

// Generate S3 Signed URL or Local Upload Endpoint
const generateUploadURL = async (req, res) => {
  console.log("DEBUG - Incoming body:", req.body);

  try {
    const { fileName, fileType } = req.body;

    if (!fileName || !fileType) {
      return res.status(400).json({ error: "fileName and fileType are required" });
    }

    // Replace spaces with underscores and remove unsafe chars
    const sanitizedFileName = fileName.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_\-\.]/g, "");
    const timestamp = Date.now();
    const fileKey = `${timestamp}-${sanitizedFileName}`;

    if (s3 && !useLocalStorage) {
      // Use S3
      const bucketName = process.env.AWS_BUCKET_NAME;
      if (!bucketName) {
        throw new Error("Bucket name is undefined! Check environment variable AWS_BUCKET_NAME.");
      }

      const params = {
        Bucket: bucketName,
        Key: fileKey,
        Expires: 60, // URL valid for 60 seconds
        ContentType: fileType,
      };

      const uploadURL = await s3.getSignedUrlPromise("putObject", params);
      const publicUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

      return res.status(200).json({
        uploadUrl: uploadURL, // for PUT to S3
        url: publicUrl,       // for saving in DB & frontend display
      });
    } else {
      // Use local storage - return endpoint for direct upload
      const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
      const uploadUrl = `${baseUrl}/api/photo/upload-local`;
      const publicUrl = `${baseUrl}/uploads/${fileKey}`;

      return res.status(200).json({
        uploadUrl: uploadUrl, // endpoint for local upload
        url: publicUrl,       // for saving in DB & frontend display
        fileKey: fileKey,     // for local storage
        useLocalStorage: true,
      });
    }
  } catch (error) {
    console.error("Error generating upload URL:", error);
    res.status(500).json({ error: "Failed to generate upload URL" });
  }
};

// Add photo to DB
const addProjectPhoto = async (req, res) => {
  try {
    const { projectId, url } = req.body;

    if (!projectId || !url) {
      return res.status(400).json({ error: "projectId and url are required" });
    }

    const photo = new Photo({ projectId, url });
    await photo.save();

    return res.status(201).json({
      message: "Photo added successfully",
      fileUrl: url,
      photo,
    });
  } catch (error) {
    console.error("Error in addProjectPhoto:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getProjectPhotos = async (req, res) => {
  try {
    const { projectId } = req.query; // coming as string

    if (!projectId) {
      return res.status(400).json({ error: "Project ID is required" });
    }

    // Cast string to ObjectId
    const photos = await Photo.find({ projectId: new mongoose.Types.ObjectId(projectId) });

    const urls = photos.map(p => p.url);

    res.status(200).json({ photos: urls });
  } catch (error) {
    console.error("Error fetching photos:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Local file upload handler (fallback when S3 is not configured)
const uploadLocal = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = req.file;
    const fileKey = req.body.fileKey || `${Date.now()}-${file.originalname.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_\-\.]/g, "")}`;
    
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, fileKey);
    fs.writeFileSync(filePath, file.buffer);

    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
    const publicUrl = `${baseUrl}/uploads/${fileKey}`;

    res.status(200).json({
      url: publicUrl,
      fileKey: fileKey,
    });
  } catch (error) {
    console.error("Error uploading file locally:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
};

module.exports = { generateUploadURL, addProjectPhoto, getProjectPhotos, uploadLocal };
