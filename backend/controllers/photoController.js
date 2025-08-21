const AWS = require("aws-sdk");
const Photo = require("../models/Photo");

// Configure AWS S3
const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  signatureVersion: "v4",
});

// Generate S3 Signed URL
const generateUploadURL = async (req, res) => {
  console.log("DEBUG - Incoming body:", req.body);

  try {
    const { fileName, fileType } = req.body;

    if (!fileName || !fileType) {
      return res.status(400).json({ error: "fileName and fileType are required" });
    }

    const bucketName = process.env.AWS_BUCKET_NAME;
    if (!bucketName) {
      throw new Error("Bucket name is undefined! Check environment variable AWS_BUCKET_NAME.");
    }

    // Replace spaces with underscores and remove unsafe chars
    const sanitizedFileName = fileName.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_\-\.]/g, "");

    const params = {
      Bucket: bucketName,
      Key: `${Date.now()}-${sanitizedFileName}`,
      Expires: 60, // URL valid for 60 seconds
      ContentType: fileType,
    };

    const uploadURL = await s3.getSignedUrlPromise("putObject", params);
    const publicUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;

    res.status(200).json({
      uploadUrl: uploadURL, // for PUT to S3
      url: publicUrl,       // for saving in DB & frontend display
    });
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

module.exports = { generateUploadURL, addProjectPhoto, getProjectPhotos };
