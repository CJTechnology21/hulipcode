const AWS = require("aws-sdk");

// Initialize S3 only if AWS credentials are provided
let s3 = null;
if (process.env.AWS_REGION && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  try {
    s3 = new AWS.S3({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    console.log("✅ AWS S3 client initialized (s3Controller)");
  } catch (error) {
    console.warn("⚠️  AWS S3 initialization failed:", error.message);
  }
} else {
  console.warn("⚠️  AWS S3 not configured. S3 features will be disabled.");
}

// Generate pre-signed URL for upload under a specific project
const generateUploadURL = async (req, res) => {
  try {
    const { filename, type, projectId } = req.body;

    if (!filename || !type || !projectId) {
      return res.status(400).json({ error: "Filename, type, and projectId are required" });
    }

    // Organize files under project folder: projects/{projectId}/uploads/{timestamp}-{filename}
    const fileKey = `projects/${projectId}/uploads/${Date.now()}-${filename}`;

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
      ContentType: type,
      Expires: 300, // URL valid for 5 minutes
    };

    const uploadUrl = await s3.getSignedUrlPromise("putObject", params);

    return res.json({
      uploadUrl,
      fileKey, // return file key for saving reference in DB
      url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`,
    });
  } catch (err) {
    console.error("Error generating signed URL:", err);
    return res.status(500).json({ error: "Failed to generate signed URL" });
  }
};

module.exports = { generateUploadURL };

