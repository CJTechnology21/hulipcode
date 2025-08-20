const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Generate pre-signed URL for upload
const generateUploadURL = async (req, res) => {
  try {
    const { filename, type } = req.body;

    if (!filename || !type) {
      return res.status(400).json({ error: "Filename and type are required" });
    }

    const fileKey = `uploads/${Date.now()}-${filename}`;

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
      ContentType: type,
      Expires: 300, // URL valid for 60s
    };

    const uploadUrl = await s3.getSignedUrlPromise("putObject", params);

    return res.json({
      uploadUrl,
      url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`,
    });
  } catch (err) {
    console.error("Error generating signed URL:", err);
    return res.status(500).json({ error: "Failed to generate signed URL" });
  }
};

module.exports = { generateUploadURL };
