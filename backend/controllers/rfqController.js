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
        console.log("Error in saving draft:", error)
        res.status(400).json({
            success: false,
            message: "Error creating RFQ",
            error: error.message,
        });
    }
};

// Publish directly (create RFQ and set suppliers)
const createAndPublishRFQ = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        // Ensure suppliers is always an array
        const suppliers = Array.isArray(req.body.suppliers)
            ? req.body.suppliers
            : req.body.suppliers
                ? [req.body.suppliers]
                : [];

        const rfqData = {
            ...req.body,
            status: "published", // force published
            architect: req.user._id,
            suppliers, // array of suppliers
        };

        const rfq = new RFQ(rfqData);
        await rfq.save();

        res.status(201).json({
            success: true,
            message: "RFQ created and published successfully",
            data: rfq,
        });
    } catch (error) {
        console.error("Error in publishing:", error);
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
        if (!req.user || !req.user._id) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const { id } = req.params;
        const rfq = await RFQ.findById(id);
        if (!rfq) {
            return res.status(404).json({ success: false, message: "RFQ not found" });
        }

        if (rfq.status === "published") {
            return res.status(400).json({ success: false, message: "RFQ is already published" });
        }

        // Update RFQ fields + set status to published
        rfq.status = "published";
        rfq.architect = req.user._id;

        // Optional updates from request body
        Object.assign(rfq, req.body);

        // Ensure suppliers is an array
        if (req.body.suppliers) {
            rfq.suppliers = Array.isArray(req.body.suppliers)
                ? req.body.suppliers
                : [req.body.suppliers];
        }

        await rfq.save();

        res.status(200).json({
            success: true,
            message: "RFQ published successfully",
            data: rfq,
        });
    } catch (error) {
        console.error("Error in publishing draft:", error);
        res.status(400).json({
            success: false,
            message: "Error publishing RFQ",
            error: error.message,
        });
    }
};

// // //publish directly 
// const createAndPublishRFQ = async (req, res) => {
//     try {
//         if (!req.user || !req.user._id) {
//             return res.status(401).json({ success: false, message: "Unauthorized" });
//         }

//         const rfqData = {
//             ...req.body,
//             status: req.body.status || "draft",          // force published
//             architect: req.user._id,      // logged-in architect
//         };

//         const rfq = new RFQ(rfqData);
//         await rfq.save();

//         res.status(201).json({
//             success: true,
//             message: "RFQ created and published successfully",
//             data: rfq,
//         });
//     } catch (error) {
//         console.error("Error in publishing:", error);
//         res.status(400).json({
//             success: false,
//             message: "Error creating & publishing RFQ",
//             error: error.message,
//         });
//     }
// };

// // Publish an existing draft RFQ
// const publishExistingRFQ = async (req, res) => {
//     try {
//         if (!req.user || !req.user._id) {
//             return res.status(401).json({ success: false, message: "Unauthorized" });
//         }

//         const { id } = req.params;
//         const rfq = await RFQ.findById(id);
//         if (!rfq) {
//             return res.status(404).json({ success: false, message: "RFQ not found" });
//         }

//         if (rfq.status === "published") {
//             return res.status(400).json({ success: false, message: "RFQ is already published" });
//         }

//         // Flip to published + optional updates
//         rfq.status = "published";
//         rfq.architect = req.user._id; // ensure architect is logged-in user
//         Object.assign(rfq, req.body); // optional updates (dates, terms, etc.)

//         await rfq.save();

//         res.status(200).json({
//             success: true,
//             message: "RFQ published successfully",
//             data: rfq,
//         });
//     } catch (error) {
//         console.error("Error in publishing draft:", error);
//         res.status(400).json({
//             success: false,
//             message: "Error publishing RFQ",
//             error: error.message,
//         });
//     }
// };

// Get all RFQs
const getRFQs = async (req, res) => {
    try {
        const rfqs = await RFQ.find()
            .populate("project", "name client location") // only pick needed fields
            .populate("suppliers", "name email phone role"); // updated to array

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

// const getRFQs = async (req, res) => {
//     try {
//         const rfqs = await RFQ.find()
//             .populate("project", "name client location") // only pick needed fields
//             .populate("supplier", "name email phone role");

//         res.status(200).json({
//             success: true,
//             count: rfqs.length,
//             data: rfqs,
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Error fetching RFQs",
//             error: error.message,
//         });
//     }
// };

// Get single RFQ by ID
const getRFQById = async (req, res) => {
    try {
        const rfq = await RFQ.findById(req.params.id)
            .populate("project", "name client location")
            .populate("suppliers", "name email phone role");

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

//  Get all RFQs by Architect ID
const getRFQsByArchitect = async (req, res) => {
    try {
        const { architectId } = req.params;

        const rfqs = await RFQ.find({ architect: architectId })
            .populate("project", "name client location")
            .populate("suppliers", "name email phone role");

        if (!rfqs || rfqs.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No RFQs found for this architect",
            });
        }

        res.status(200).json({
            success: true,
            count: rfqs.length,
            data: rfqs,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching RFQs by architect",
            error: error.message,
        });
    }
};

//  Get all RFQs by Project ID
const getRFQsByProject = async (req, res) => {
    try {
        const { projectId } = req.params;

        const rfqs = await RFQ.find({ project: projectId })
            .populate("project", "name client location")
            .populate("suppliers", "name email phone role");

        if (!rfqs || rfqs.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No RFQs found for this project",
            });
        }

        res.status(200).json({
            success: true,
            count: rfqs.length,
            data: rfqs,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching RFQs by project",
            error: error.message,
        });
    }
};


// MATERIAL CONTROLLERS  

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
//  RESPONSE CONTROLLERS 
// Add one or multiple responses to an RFQ
const addResponseToRFQ = async (req, res) => {
    try {
        const { id } = req.params;
        const { supplierId, responses, tax = 0 } = req.body;

        if (!supplierId || !Array.isArray(responses) || responses.length === 0) {
            return res.status(400).json({
                success: false,
                message: "SupplierId and at least one response item are required",
            });
        }

        const rfq = await RFQ.findById(id);
        if (!rfq) {
            return res.status(404).json({ success: false, message: "RFQ not found" });
        }

        const quotes = responses.map(item => ({
            material: item.materialId,
            productName: item.name,
            price: item.price,
            quantity: item.quantity,
            remarks: item.remarks || "",
        }));

        const baseTotal = responses.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const taxAmount = (Number(tax) / 100) * baseTotal;
        const totalAmount = baseTotal + taxAmount;

        // Update only responses
        const updatedRFQ = await RFQ.findByIdAndUpdate(
            id,
            { $push: { responses: { supplier: supplierId, quotes, tax: Number(tax), totalAmount } } },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Responses added successfully",
            data: updatedRFQ.responses
        });

    } catch (error) {
        // console.error("🔥 Error in addResponseToRFQ:", error);
        res.status(400).json({
            success: false,
            message: "Error adding responses",
            error: error.message,
        });
    }
};

// Get all responses for a given RFQ
const getResponsesOfRFQ = async (req, res) => {
    try {
        const { id } = req.params;
        const rfq = await RFQ.findById(id)
            .populate("responses.supplier", "name email phone");

        if (!rfq) {
            return res.status(404).json({ success: false, message: "RFQ not found" });
        }

        res.status(200).json({
            success: true,
            rfq, // include the whole RFQ
            responses: rfq.responses,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching responses",
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
    addResponseToRFQ,
    getResponsesOfRFQ,
    getRFQsByArchitect,
    getRFQsByProject,
}