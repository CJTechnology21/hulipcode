/**
 * Project State Machine Service
 * Manages project lifecycle state transitions with validation
 * 
 * State Flow:
 * NEW → BRIEFED → QUOTED → CONTRACT_PENDING → CONTRACT_SIGNED → 
 * READY_TO_START → IN_PROGRESS → QA → COMPLETED → CLOSED
 */

const PROJECT_STATES = {
  NEW: 'NEW',
  BRIEFED: 'BRIEFED',
  QUOTED: 'QUOTED',
  CONTRACT_PENDING: 'CONTRACT_PENDING',
  CONTRACT_SIGNED: 'CONTRACT_SIGNED',
  READY_TO_START: 'READY_TO_START',
  IN_PROGRESS: 'IN_PROGRESS',
  QA: 'QA',
  COMPLETED: 'COMPLETED',
  CLOSED: 'CLOSED',
};

// Valid state transitions
const VALID_TRANSITIONS = {
  [PROJECT_STATES.NEW]: [PROJECT_STATES.BRIEFED],
  [PROJECT_STATES.BRIEFED]: [PROJECT_STATES.QUOTED],
  [PROJECT_STATES.QUOTED]: [PROJECT_STATES.CONTRACT_PENDING],
  [PROJECT_STATES.CONTRACT_PENDING]: [PROJECT_STATES.CONTRACT_SIGNED, PROJECT_STATES.QUOTED], // Can go back if contract rejected
  [PROJECT_STATES.CONTRACT_SIGNED]: [PROJECT_STATES.READY_TO_START],
  [PROJECT_STATES.READY_TO_START]: [PROJECT_STATES.IN_PROGRESS],
  [PROJECT_STATES.IN_PROGRESS]: [PROJECT_STATES.QA, PROJECT_STATES.READY_TO_START], // Can pause and go back
  [PROJECT_STATES.QA]: [PROJECT_STATES.IN_PROGRESS, PROJECT_STATES.COMPLETED], // Can go back for fixes
  [PROJECT_STATES.COMPLETED]: [PROJECT_STATES.CLOSED],
  [PROJECT_STATES.CLOSED]: [], // Terminal state - no transitions allowed
};

// State descriptions for UI
const STATE_DESCRIPTIONS = {
  [PROJECT_STATES.NEW]: 'New project created',
  [PROJECT_STATES.BRIEFED]: 'Client brief received',
  [PROJECT_STATES.QUOTED]: 'Quote sent to client',
  [PROJECT_STATES.CONTRACT_PENDING]: 'Waiting for contract signature',
  [PROJECT_STATES.CONTRACT_SIGNED]: 'Contract signed',
  [PROJECT_STATES.READY_TO_START]: 'Ready to begin work',
  [PROJECT_STATES.IN_PROGRESS]: 'Work in progress',
  [PROJECT_STATES.QA]: 'Quality assurance review',
  [PROJECT_STATES.COMPLETED]: 'Project completed',
  [PROJECT_STATES.CLOSED]: 'Project closed',
};

// State colors for UI
const STATE_COLORS = {
  [PROJECT_STATES.NEW]: 'bg-gray-500',
  [PROJECT_STATES.BRIEFED]: 'bg-blue-500',
  [PROJECT_STATES.QUOTED]: 'bg-yellow-500',
  [PROJECT_STATES.CONTRACT_PENDING]: 'bg-orange-500',
  [PROJECT_STATES.CONTRACT_SIGNED]: 'bg-purple-500',
  [PROJECT_STATES.READY_TO_START]: 'bg-indigo-500',
  [PROJECT_STATES.IN_PROGRESS]: 'bg-green-500',
  [PROJECT_STATES.QA]: 'bg-pink-500',
  [PROJECT_STATES.COMPLETED]: 'bg-emerald-500',
  [PROJECT_STATES.CLOSED]: 'bg-gray-700',
};

/**
 * Check if a state transition is valid
 * @param {string} currentState - Current project state
 * @param {string} newState - Desired new state
 * @returns {Object} { valid: boolean, reason?: string }
 */
const canTransition = (currentState, newState) => {
  // Same state is always valid (no-op)
  if (currentState === newState) {
    return { valid: true };
  }

  // Check if current state exists
  if (!VALID_TRANSITIONS[currentState]) {
    return {
      valid: false,
      reason: `Invalid current state: ${currentState}`,
    };
  }

  // Check if new state exists
  if (!PROJECT_STATES[newState]) {
    return {
      valid: false,
      reason: `Invalid target state: ${newState}`,
    };
  }

  // Check if transition is allowed
  const allowedTransitions = VALID_TRANSITIONS[currentState];
  if (!allowedTransitions.includes(newState)) {
    return {
      valid: false,
      reason: `Cannot transition from ${currentState} to ${newState}. Allowed transitions: ${allowedTransitions.join(', ')}`,
    };
  }

  return { valid: true };
};

/**
 * Get all valid next states for a given current state
 * @param {string} currentState - Current project state
 * @returns {string[]} Array of valid next states
 */
const getValidNextStates = (currentState) => {
  return VALID_TRANSITIONS[currentState] || [];
};

/**
 * Validate and transition project state
 * @param {Object} project - Project document
 * @param {string} newState - Desired new state
 * @returns {Object} { success: boolean, error?: string, validTransition?: boolean }
 */
const validateTransition = (project, newState) => {
  const currentState = project.status;
  const transitionCheck = canTransition(currentState, newState);

  if (!transitionCheck.valid) {
    return {
      success: false,
      error: transitionCheck.reason,
      validTransition: false,
    };
  }

  return {
    success: true,
    validTransition: true,
  };
};

/**
 * Get state description
 * @param {string} state - Project state
 * @returns {string} State description
 */
const getStateDescription = (state) => {
  return STATE_DESCRIPTIONS[state] || 'Unknown state';
};

/**
 * Get state color for UI
 * @param {string} state - Project state
 * @returns {string} Tailwind CSS color class
 */
const getStateColor = (state) => {
  return STATE_COLORS[state] || 'bg-gray-300';
};

/**
 * Get all project states
 * @returns {string[]} Array of all valid states
 */
const getAllStates = () => {
  return Object.values(PROJECT_STATES);
};

/**
 * Check if state is terminal (no further transitions)
 * @param {string} state - Project state
 * @returns {boolean}
 */
const isTerminalState = (state) => {
  return state === PROJECT_STATES.CLOSED;
};

/**
 * Get initial state for new projects
 * @returns {string}
 */
const getInitialState = () => {
  return PROJECT_STATES.NEW;
};

/**
 * Get state for project created from quote
 * @returns {string}
 */
const getStateForQuoteProject = () => {
  return PROJECT_STATES.CONTRACT_SIGNED; // When project is created from quote, contract is already signed
};

module.exports = {
  PROJECT_STATES,
  VALID_TRANSITIONS,
  canTransition,
  getValidNextStates,
  validateTransition,
  getStateDescription,
  getStateColor,
  getAllStates,
  isTerminalState,
  getInitialState,
  getStateForQuoteProject,
};





