const express = require('express')
const router = express.Router();
const { createRFQ, getRFQs, getRFQById, updateRFQ, deleteRFQ } = require('../controllers/rfqController')
const { protect } = require('../middleware/authMiddleware');

//get all rfqs
router.get('/', getRFQs);
//get rfq by Id
router.get("/:id", getRFQById);
//create rfq
router.post('/', protect, createRFQ);
//update rfq
router.put('/:id', protect, updateRFQ);
//delete rfq
router.delete('/;id', protect, deleteRFQ)
module.exports = router;