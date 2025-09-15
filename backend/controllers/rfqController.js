const RFQ = require("../models/RFQ");

//  Create new RFQ
const createRFQ = async (req, res) => {
    try {
        const rfq = new RFQ(req.body);
        await rfq.save();

        res.status(201).json({
            success: true,
            message: "RFQ created successfully",
            data: rfq,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error creating RFQ",
            error: error.message,
        });
    }
};

//publish directly 
const createAndPublishRFQ = async (req, res) => {
    try {
        // Force status to "published" no matter what frontend sends
        const rfq = new RFQ({ ...req.body, status: "published" });
        await rfq.save();

        res.status(201).json({
            success: true,
            message: "RFQ created and published successfully",
            data: rfq,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error creating & publishing RFQ",
            error: error.message,
        });
    }
};

// Publish an existing draft RFQ
const publishExistingRFQ = async (req, res) => {
    try {
        const { id } = req.params;

        const rfq = await RFQ.findById(id);
        if (!rfq) {
            return res.status(404).json({ success: false, message: "RFQ not found" });
        }

        if (rfq.status === "published") {
            return res.status(400).json({ success: false, message: "RFQ is already published" });
        }

        // Flip to published + allow optional updates from req.body
        rfq.status = "published";
        Object.assign(rfq, req.body); // optional: update dates, terms, etc.
        await rfq.save();

        res.status(200).json({
            success: true,
            message: "RFQ published successfully",
            data: rfq,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error publishing RFQ",
            error: error.message,
        });
    }
};



// Get all RFQs
const getRFQs = async (req, res) => {
    try {
        const rfqs = await RFQ.find()
            .populate("project", "name client location") // only pick needed fields
            .populate("supplier", "name email phone role");

        res.status(200).json({
            success: true,
            count: rfqs.length,
            data: rfqs,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching RFQs",
            error: error.message,
        });
    }
};

// Get single RFQ by ID
const getRFQById = async (req, res) => {
    try {
        const rfq = await RFQ.findById(req.params.id)
            .populate("project", "name client location")
            .populate("supplier", "name email phone role");

        if (!rfq) {
            return res.status(404).json({ success: false, message: "RFQ not found" });
        }

        res.status(200).json({ success: true, data: rfq });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching RFQ",
            error: error.message,
        });
    }
};

// Update RFQ
const updateRFQ = async (req, res) => {
    try {
        const rfq = await RFQ.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!rfq) {
            return res.status(404).json({ success: false, message: "RFQ not found" });
        }

        res.status(200).json({
            success: true,
            message: "RFQ updated successfully",
            data: rfq,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error updating RFQ",
            error: error.message,
        });
    }
};

//  Delete RFQ
const deleteRFQ = async (req, res) => {
    try {
        const rfq = await RFQ.findByIdAndDelete(req.params.id);

        if (!rfq) {
            return res.status(404).json({ success: false, message: "RFQ not found" });
        }

        res.status(200).json({
            success: true,
            message: "RFQ deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting RFQ",
            error: error.message,
        });
    }
};

// MATERIAL CONTROLLERS  

// Add one or multiple materials to an RFQ
// Add one or multiple materials to an RFQ
const addMaterialsToRFQ = async (req, res) => {
    try {
        const { id } = req.params; // RFQ ID
        const materials = Array.isArray(req.body) ? req.body : [req.body];

        // Ensure each material includes the product name
        const materialsWithName = materials.map((m) => ({
            ...m,
            name: m.name || (m.productName || ""), // use provided name or fallback
        }));

        const rfq = await RFQ.findById(id);
        if (!rfq) {
            return res.status(404).json({ success: false, message: "RFQ not found" });
        }

        rfq.materials.push(...materialsWithName);
        await rfq.save();

        res.status(200).json({
            success: true,
            message: "Materials added successfully",
            data: rfq.materials,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error adding materials",
            error: error.message,
        });
    }
};

// const addMaterialsToRFQ = async (req, res) => {
//     try {
//         const { id } = req.params; // RFQ ID
//         const materials = Array.isArray(req.body) ? req.body : [req.body];

//         const rfq = await RFQ.findById(id);
//         if (!rfq) {
//             return res.status(404).json({ success: false, message: "RFQ not found" });
//         }

//         rfq.materials.push(...materials);
//         await rfq.save();

//         res.status(200).json({
//             success: true,
//             message: "Materials added successfully",
//             data: rfq.materials,
//         });
//     } catch (error) {
//         res.status(400).json({
//             success: false,
//             message: "Error adding materials",
//             error: error.message,
//         });
//     }
// };

// Update a specific material inside RFQ
const updateMaterialInRFQ = async (req, res) => {
    try {
        const { id, materialId } = req.params;

        const rfq = await RFQ.findById(id);
        if (!rfq) {
            return res.status(404).json({ success: false, message: "RFQ not found" });
        }

        const material = rfq.materials.id(materialId);
        if (!material) {
            return res.status(404).json({ success: false, message: "Material not found" });
        }

        Object.assign(material, req.body); // shallow merge updates
        await rfq.save();

        res.status(200).json({
            success: true,
            message: "Material updated successfully",
            data: material,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error updating material",
            error: error.message,
        });
    }
};

// Delete a specific material inside RFQ
const deleteMaterialFromRFQ = async (req, res) => {
    try {
        const { id, materialId } = req.params;

        const rfq = await RFQ.findById(id);
        if (!rfq) {
            return res.status(404).json({ success: false, message: "RFQ not found" });
        }

        const material = rfq.materials.id(materialId);
        if (!material) {
            return res.status(404).json({ success: false, message: "Material not found" });
        }

        material.remove();
        await rfq.save();

        res.status(200).json({
            success: true,
            message: "Material deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting material",
            error: error.message,
        });
    }
};

// Fetch all materials of a given RFQ
const getMaterialsOfRFQ = async (req, res) => {
    try {
        const { id } = req.params;
        const rfq = await RFQ.findById(id).populate("materials.product", "name hsn unit");
        if (!rfq) {
            return res.status(404).json({ success: false, message: "RFQ not found" });
        }

        res.status(200).json({
            success: true,
            count: rfq.materials.length,
            data: rfq.materials,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching materials",
            error: error.message,
        });
    }
};


module.exports = {
    createRFQ,
    getRFQs,
    getRFQById,
    updateRFQ,
    deleteRFQ,
    addMaterialsToRFQ,
    updateMaterialInRFQ,
    deleteMaterialFromRFQ,
    getMaterialsOfRFQ,
    createAndPublishRFQ,
    publishExistingRFQ,
}