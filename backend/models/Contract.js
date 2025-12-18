const mongoose = require('mongoose');

/**
 * Contract Model
 * Tracks contract documents, versions, signatures, and PDFs
 */
const contractSchema = new mongoose.Schema(
  {
    quoteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quote',
      required: true,
      index: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      // Optional - contract may exist before project is created
      index: true,
    },
    version_number: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
      // Version number for contract revisions
    },
    terms_blob: {
      type: mongoose.Schema.Types.Mixed,
      // JSON blob containing contract terms and conditions
      // Can store structured contract data
    },
    pdf_url: {
      type: String,
      // URL to the signed/unsigned PDF document
      // Can be S3 URL, CDN URL, or file path
    },
    signed_by_client: {
      type: Boolean,
      default: false,
      // Whether client has signed the contract
    },
    signed_by_professional: {
      type: Boolean,
      default: false,
      // Whether professional/architect has signed the contract
    },
    // Signature details
    clientSignature: {
      signedAt: Date,
      signedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      signatureMethod: {
        type: String,
        enum: ['e-signature', 'manual', 'leegality'],
        default: 'leegality',
      },
      documentId: String, // Leegality document ID
    },
    professionalSignature: {
      signedAt: Date,
      signedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      signatureMethod: {
        type: String,
        enum: ['e-signature', 'manual', 'leegality'],
        default: 'leegality',
      },
      documentId: String, // Leegality document ID
    },
    // Contract status
    status: {
      type: String,
      enum: ['draft', 'pending_signature', 'partially_signed', 'fully_signed', 'cancelled', 'expired'],
      default: 'draft',
    },
    // Leegality integration fields
    leegalityDocumentId: {
      type: String,
      // Document ID from Leegality API
    },
    leegalitySigningLinks: [
      {
        signerEmail: String,
        signerName: String,
        signingUrl: String,
        status: {
          type: String,
          enum: ['sent', 'opened', 'signed', 'expired'],
        },
        sentAt: Date,
        signedAt: Date,
      },
    ],
    // Contract metadata
    metadata: {
      totalAmount: Number,
      currency: {
        type: String,
        default: 'INR',
      },
      contractType: {
        type: String,
        enum: ['msa', 'work_order', 'amendment', 'other'],
        default: 'msa',
      },
      expiresAt: Date,
      notes: String,
    },
  },
  { timestamps: true }
);

// Indexes for performance
contractSchema.index({ quoteId: 1, version_number: 1 });
contractSchema.index({ projectId: 1 });
contractSchema.index({ status: 1 });
contractSchema.index({ leegalityDocumentId: 1 });

// Virtual: Check if contract is fully signed
contractSchema.virtual('isFullySigned').get(function () {
  return this.signed_by_client && this.signed_by_professional;
});

// Method: Mark client signature
contractSchema.methods.markClientSigned = async function (userId, documentId = null, req = null) {
  this.signed_by_client = true;
  this.clientSignature = {
    signedAt: new Date(),
    signedBy: userId,
    signatureMethod: 'leegality',
    documentId: documentId || this.leegalityDocumentId,
  };

  // Update status
  if (this.signed_by_professional) {
    this.status = 'fully_signed';
  } else {
    this.status = 'partially_signed';
  }

  await this.save();

  // Create audit log entry
  try {
    const { logContractSigning } = require('../services/auditService');
    await logContractSigning({
      contractId: this._id,
      actorId: userId,
      signerType: 'client',
      metadata: {
        documentId: documentId || this.leegalityDocumentId,
        version_number: this.version_number,
        projectId: this.projectId,
        quoteId: this.quoteId,
      },
      req,
    });
  } catch (auditError) {
    console.error('Error creating audit log for contract signing:', auditError);
    // Don't fail the signing if audit logging fails
  }

  return this;
};

// Method: Mark professional signature
contractSchema.methods.markProfessionalSigned = async function (userId, documentId = null, req = null) {
  this.signed_by_professional = true;
  this.professionalSignature = {
    signedAt: new Date(),
    signedBy: userId,
    signatureMethod: 'leegality',
    documentId: documentId || this.leegalityDocumentId,
  };

  // Update status
  if (this.signed_by_client) {
    this.status = 'fully_signed';
  } else {
    this.status = 'partially_signed';
  }

  await this.save();

  // Create audit log entry
  try {
    const { logContractSigning } = require('../services/auditService');
    await logContractSigning({
      contractId: this._id,
      actorId: userId,
      signerType: 'professional',
      metadata: {
        documentId: documentId || this.leegalityDocumentId,
        version_number: this.version_number,
        projectId: this.projectId,
        quoteId: this.quoteId,
      },
      req,
    });
  } catch (auditError) {
    console.error('Error creating audit log for contract signing:', auditError);
    // Don't fail the signing if audit logging fails
  }

  return this;
};

// Pre-save hook: Update status based on signatures
contractSchema.pre('save', function (next) {
  if (this.signed_by_client && this.signed_by_professional) {
    this.status = 'fully_signed';
  } else if (this.signed_by_client || this.signed_by_professional) {
    this.status = 'partially_signed';
  } else if (this.status === 'draft') {
    // Keep draft status if not signed
  } else if (!this.status || this.status === 'draft') {
    this.status = 'pending_signature';
  }
  next();
});

module.exports = mongoose.model('Contract', contractSchema);

