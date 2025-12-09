// backend/routes/upload.js
const express = require("express");
const multer = require("multer");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const Photo = require("../models/Photo");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Initialize S3 only if AWS credentials are provided
let s3 = null;
if (process.env.AWS_REGION && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  try {
    s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    console.log("✅ AWS S3 client initialized (upload route)");
  } catch (error) {
    console.warn("⚠️  AWS S3 initialization failed:", error.message);
  }
} else {
  console.warn("⚠️  AWS S3 not configured. Upload features will be disabled.");
}

router.post("/", upload.single("file"), async (req, res) => {
  try {
    // Check if S3 is configured
    if (!s3) {
      return res.status(503).json({ 
        error: "File upload service is not configured. Please configure AWS S3 credentials." 
      });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const key = `uploads/${Date.now()}_${file.originalname}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
    );

    // Construct a public URL
    const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    // Save in MongoDB
    const photo = new Photo({ url });
    await photo.save();

    res.json({ url, photoId: photo._id, message: "Uploaded & saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// get all uploaded photos
router.get("/", async (req, res) => {
  try {
    const photos = await Photo.find().sort({ uploadedAt: -1 });
    res.json(photos);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch photos" });
  }
});

module.exports = router;

// // backend/routes/upload.js
// const express = require("express");
// const multer = require("multer");
// const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

// const router = express.Router();
// const upload = multer({ storage: multer.memoryStorage() });

// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// router.post("/", upload.single("file"), async (req, res) => {
//   try {
//     const file = req.file;
//     const key = `uploads/${Date.now()}_${file.originalname}`;

//     await s3.send(
//       new PutObjectCommand({
//         Bucket: process.env.AWS_BUCKET_NAME,
//         Key: key,
//         Body: file.buffer,
//         ContentType: file.mimetype,
//       })
//     );

//     // Construct a public URL
//     const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

//     res.json({ url });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Upload failed" });
//   }
// });

// module.exports = router;
