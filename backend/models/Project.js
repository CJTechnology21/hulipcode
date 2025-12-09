
const mongoose = require('mongoose');
const Counter = require('./Counter');

const projectSchema = new mongoose.Schema({
    id: { type: String },
    name: { type: String, required: true },
    client: { type: String, required: true },
    location: { type: String, required: true },
    category: {
        type: String,
        enum: ['RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL', 'RETAIL'],
        required: true
    },
    status: {
        type: String,
        enum: ['NEW', 'BRIEFED', 'QUOTED', 'CONTRACT_PENDING', 'CONTRACT_SIGNED', 'READY_TO_START', 'IN_PROGRESS', 'QA', 'COMPLETED', 'CLOSED'],
        default: 'NEW',
        required: true
    },
    progress: { type: Number, min: 0, max: 100 },
    cashFlow: { type: Number, default: 0 },
    isHuelip: { type: Boolean, default: false },
    architectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    quoteId: { type: mongoose.Schema.Types.ObjectId, ref: "Quote" }, // ✅ added
}, { timestamps: true });

// Pre-save hook to generate auto ID
projectSchema.pre('save', async function (next) {
    if (!this.id) {
        try {
            const counter = await Counter.findOneAndUpdate(
                { name: 'projectId' },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            this.id = 'p' + String(counter.seq).padStart(3, '0'); // p001, p002, etc.
            next();
        } catch (err) {
            next(err);
        }
    } else {
        next();
    }
});

module.exports = mongoose.model('Project', projectSchema);
