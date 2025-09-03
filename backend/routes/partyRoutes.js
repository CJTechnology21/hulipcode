const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware")
const {
    createParty,
    getPartiesByProject,
    getPartyById,
    updateParty,
    deleteParty,
    getAllParties,
} = require("../controllers/partyController");

//  Create new party
router.post("/", protect, createParty);


//Get All parites
router.get("/",getAllParties)

//  Get all parties (with optional filters: ?projectId=xxx, ?type=Vendor)
router.get("/", getPartiesByProject);

//  Get single party by ID
router.get("/:id", getPartyById);

//  Full update (PUT)
router.put("/:id", protect, updateParty);

//  Delete party
router.delete("/:id", protect, deleteParty);

module.exports = router;
