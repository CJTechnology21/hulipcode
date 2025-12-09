/**
 * Task Proof Validation Service
 * Validates task proofs before submission
 * 
 * Rules:
 * - 3 photos OR 1 video OR checklist complete
 * - GPS tag required for all proofs
 * - Timestamps must be after task start date
 */

/**
 * Validate task proofs
 * @param {Object} task - Task document
 * @param {Array} proofs - Array of proof objects
 * @returns {Object} { valid: boolean, errors: string[] }
 */
const validateProofs = (task, proofs = []) => {
  const errors = [];

  // Check if proofs array is provided
  if (!proofs || proofs.length === 0) {
    errors.push('At least one proof is required');
    return { valid: false, errors };
  }

  // Check if task has startDate
  if (!task.startDate) {
    errors.push('Task must have a start date before submission');
    return { valid: false, errors };
  }

  const photos = proofs.filter(p => p.type === 'photo');
  const videos = proofs.filter(p => p.type === 'video');
  const checklistProofs = proofs.filter(p => p.type === 'checklist');

  // Validate: 3 photos OR 1 video OR checklist complete
  const hasValidPhotoCount = photos.length >= 3;
  const hasValidVideoCount = videos.length >= 1;
  const isChecklistComplete = task.checklist && task.checklist.length > 0 && 
    task.checklist.every(item => item.completed === true);

  if (!hasValidPhotoCount && !hasValidVideoCount && !isChecklistComplete) {
    errors.push('Must provide either 3+ photos, 1+ video, or complete checklist');
  }

  // Validate each proof
  proofs.forEach((proof, index) => {
    // Check GPS tag
    if (!proof.gps || typeof proof.gps.latitude !== 'number' || typeof proof.gps.longitude !== 'number') {
      errors.push(`Proof ${index + 1}: GPS coordinates (latitude, longitude) are required`);
    }

    // Validate GPS coordinates range
    if (proof.gps) {
      if (proof.gps.latitude < -90 || proof.gps.latitude > 90) {
        errors.push(`Proof ${index + 1}: Invalid latitude (must be between -90 and 90)`);
      }
      if (proof.gps.longitude < -180 || proof.gps.longitude > 180) {
        errors.push(`Proof ${index + 1}: Invalid longitude (must be between -180 and 180)`);
      }
    }

    // Check timestamp
    if (!proof.timestamp) {
      errors.push(`Proof ${index + 1}: Timestamp is required`);
    } else {
      const proofTime = new Date(proof.timestamp);
      const taskStartTime = new Date(task.startDate);

      if (isNaN(proofTime.getTime())) {
        errors.push(`Proof ${index + 1}: Invalid timestamp format`);
      } else if (proofTime < taskStartTime) {
        errors.push(`Proof ${index + 1}: Timestamp must be after task start date (${taskStartTime.toISOString()})`);
      }
    }

    // Check URL
    if (!proof.url || typeof proof.url !== 'string' || proof.url.trim() === '') {
      errors.push(`Proof ${index + 1}: URL is required`);
    }

    // Video-specific validation
    if (proof.type === 'video' && !proof.thumbnail) {
      // Thumbnail is recommended but not required
      // errors.push(`Proof ${index + 1}: Video thumbnail is required`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validate checklist completion
 * @param {Array} checklist - Checklist items
 * @returns {boolean}
 */
const isChecklistComplete = (checklist = []) => {
  if (!checklist || checklist.length === 0) {
    return false;
  }
  return checklist.every(item => item.completed === true);
};

/**
 * Get proof validation summary
 * @param {Object} task - Task document
 * @returns {Object} Summary of proof validation
 */
const getProofValidationSummary = (task) => {
  const proofs = task.proofs || [];
  const photos = proofs.filter(p => p.type === 'photo');
  const videos = proofs.filter(p => p.type === 'video');
  const checklistComplete = isChecklistComplete(task.checklist);

  return {
    totalProofs: proofs.length,
    photoCount: photos.length,
    videoCount: videos.length,
    checklistComplete,
    hasValidProofs: photos.length >= 3 || videos.length >= 1 || checklistComplete,
    allProofsHaveGPS: proofs.every(p => p.gps && p.gps.latitude && p.gps.longitude),
    allProofsHaveTimestamps: proofs.every(p => p.timestamp),
    allTimestampsValid: proofs.every(p => {
      if (!p.timestamp || !task.startDate) return false;
      return new Date(p.timestamp) >= new Date(task.startDate);
    }),
  };
};

module.exports = {
  validateProofs,
  isChecklistComplete,
  getProofValidationSummary,
};





