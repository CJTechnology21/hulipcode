const TwoDLayout = require("../models/TwoDLayout");
const AWS = require("aws-sdk");
const mongoose = require("mongoose");
const multer = require("multer");

// Initialize S3 only if AWS credentials are provided
let s3 = null;
if (process.env.AWS_REGION && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  try {
    s3 = new AWS.S3({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      signatureVersion: "v4",
    });
    console.log("✅ AWS S3 client initialized (twoDLayoutController)");
  } catch (error) {
    console.warn("⚠️  AWS S3 initialization failed:", error.message);
  }
} else {
  console.warn("⚠️  AWS S3 not configured. 2D Layout upload features will be disabled.");
}

// Multer memory storage for single file
const storage = multer.memoryStorage();
const upload = multer({ storage }).single("file"); // field name = 'file'

// Upload file to S3 and return public URL
const uploadToS3 = async (file) => {
  if (!s3) {
    throw new Error("S3 is not configured. Please configure AWS S3 credentials.");
  }

  const bucketName = process.env.AWS_BUCKET_NAME;
  const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;

  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const data = await s3.upload(params).promise();

  // Return public URL
  return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
};


// Get all layouts
const getAllLayouts = async (req, res) => {
    try {
        const layouts = await TwoDLayout.find();
        res.status(200).json(layouts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get single layout by ID
const getLayoutById = async (req, res) => {
    try {
        const layout = await TwoDLayout.findById(req.params.id);
        if (!layout) return res.status(404).json({ error: "Layout not found" });
        res.status(200).json(layout);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update full layout (PUT)
const updateLayout = async (req, res) => {
    try {
        const updatedLayout = await TwoDLayout.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedLayout) return res.status(404).json({ error: "Layout not found" });
        res.status(200).json(updatedLayout);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Patch layout (add new version)
const patchLayout = async (req, res) => {
    upload(req, res, async function (err) {
        try {
            if (err) {
                return res.status(400).json({ error: "File upload error", details: err.message });
            }

            const layout = await TwoDLayout.findById(req.params.id);
            if (!layout) return res.status(404).json({ error: "Layout not found" });

            // If a file is uploaded, create new version
            if (req.file) {
                if (!["image/png", "image/jpeg", "image/jpg", "application/pdf"].includes(req.file.mimetype)) {
                    return res.status(400).json({ error: "Only PNG, JPEG, JPG or PDF files are allowed" });
                }
                const fileUrl = await uploadToS3(req.file);
                const nextVersionLabel = `V${(layout.versions.length || 0) + 1}`;
                layout.versions.push({ label: nextVersionLabel, image: fileUrl });
            }

            // Update other fields if present
            Object.keys(req.body).forEach((key) => {
                if (key !== "file") layout[key] = req.body[key];
            });

            await layout.save();
            res.status(200).json(layout);
        } catch (error) {
            console.error("Patch Layout Error:", error);
            res.status(500).json({ error: error.message });
        }
    });
};

// Delete layout
const deleteLayout = async (req, res) => {
    try {
        const deleted = await TwoDLayout.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Layout not found" });
        res.status(200).json({ message: "Layout deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get layouts by projectId
const getLayoutsByProject = async (req, res) => {
  try {
    const { projectId } = req.query;

    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid or missing projectId" });
    }

    const layouts = await TwoDLayout.find({
      projectId: new mongoose.Types.ObjectId(projectId), // ✅ convert string to ObjectId
    }).sort({ createdAt: -1 });

    if (!layouts.length) {
      return res.status(404).json({ message: "No layouts found for this project" });
    }

    res.status(200).json(layouts); // ✅ send plain array
  } catch (err) {
    console.error("Get Layouts Error:", err);
    res.status(500).json({ message: "Server error while fetching layouts" });
  }
};


// Create new layout
const createLayout = async (req, res) => {
    upload(req, res, async function (err) {
        try {
            if (err) {
                return res.status(400).json({ error: "File upload error", details: err.message });
            }

            const { projectId, name, area, fileTypes, assigned, status } = req.body;

            if (!req.file) {
                return res.status(400).json({ error: "You must upload a file for the first version" });
            }

            if (!["image/png", "image/jpeg", "image/jpg", "application/pdf"].includes(req.file.mimetype)) {
                return res.status(400).json({ error: "Only PNG, JPEG, JPG or PDF files are allowed" });
            }

            if (!projectId || !name || !area) {
                return res.status(400).json({ error: "Missing required fields" });
            }

            // Upload first version to S3
            const fileUrl = await uploadToS3(req.file);

            const versions = [{ label: "V1", image: fileUrl }];

            const layout = new TwoDLayout({
                projectId,
                name,
                area,
                fileTypes: fileTypes ? fileTypes.split(",") : [],
                assigned: assigned ? JSON.parse(assigned) : {},
                status: status || "Draft",
                versions,
            });

            await layout.save();
            res.status(201).json(layout);
        } catch (error) {
            console.error("Create Layout Error:", error);
            res.status(500).json({ error: error.message });
        }
    });
};

// Add a comment to a layout
const addCommentToLayout = async (req, res) => {
  try {
    const { layoutId, text } = req.body;
    const userId = req.user._id; // from auth middleware

    if (!layoutId || !mongoose.Types.ObjectId.isValid(layoutId)) {
      return res.status(400).json({ message: "Invalid layoutId" });
    }
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const layout = await TwoDLayout.findById(layoutId);
    if (!layout) {
      return res.status(404).json({ message: "Layout not found" });
    }

    const comment = { author: userId, text };
    layout.comments.push(comment);
    await layout.save();

    // Populate author info
    const populatedComment = await layout.populate({
      path: "comments.author",
      select: "name email profilePic",
    });

    res.status(201).json(populatedComment.comments.slice(-1)[0]); // return the newly added comment
  } catch (err) {
    console.error("Add Comment Error:", err);
    res.status(500).json({ message: "Server error while adding comment" });
  }
};
// Get all comments for a specific project
const getCommentsByProject = async (req, res) => {
  try {
    const { projectId } = req.query;

    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid projectId" });
    }

    const layouts = await TwoDLayout.find({ projectId })
      .select("comments") // get only comments
      .populate("comments.author", "name email profilePic")
      .sort({ createdAt: -1 });

    // Flatten comments from all layouts
    const comments = layouts.flatMap((layout) =>
      layout.comments.map((c) => ({ ...c.toObject(), layoutId: layout._id }))
    );

    res.status(200).json(comments);
  } catch (err) {
    console.error("Get Comments Error:", err);
    res.status(500).json({ message: "Server error while fetching comments" });
  }
};

module.exports = {
    getAllLayouts,
    getLayoutById,
    createLayout,
    updateLayout,
    patchLayout,
    deleteLayout,
    getLayoutsByProject,
    addCommentToLayout,
    getCommentsByProject,
}