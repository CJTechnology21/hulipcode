/**
 * AES Encryption Utility for PII (Personally Identifiable Information)
 * Encrypts/decrypts sensitive fields like email and phone numbers
 * 
 * Uses AES-256-GCM for authenticated encryption
 */

const crypto = require('crypto');

// Encryption configuration
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // 16 bytes for AES
const SALT_LENGTH = 64; // 64 bytes for key derivation
const TAG_LENGTH = 16; // 16 bytes for authentication tag
const KEY_LENGTH = 32; // 32 bytes for AES-256

/**
 * Get encryption key from environment variable
 * Falls back to a default key in development (NOT SECURE FOR PRODUCTION)
 */
const getEncryptionKey = () => {
  const key = process.env.ENCRYPTION_KEY || process.env.AES_ENCRYPTION_KEY;
  
  if (!key) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('ENCRYPTION_KEY environment variable is required in production');
    }
    // Development fallback - WARNING: Not secure!
    console.warn('⚠️  Using default encryption key. Set ENCRYPTION_KEY in production!');
    return crypto.scryptSync('default-dev-key-change-in-production', 'salt', KEY_LENGTH);
  }

  // If key is a hex string, convert it; otherwise derive from string
  if (key.length === 64 && /^[0-9a-fA-F]+$/.test(key)) {
    // Hex string (64 chars = 32 bytes)
    return Buffer.from(key, 'hex');
  }

  // Derive key from string using scrypt
  return crypto.scryptSync(key, 'huelip-salt', KEY_LENGTH);
};

/**
 * Encrypt a string value
 * @param {string} plaintext - The value to encrypt
 * @returns {string} Encrypted value in format: iv:salt:tag:encryptedData (base64)
 */
const encrypt = (plaintext) => {
  if (!plaintext || typeof plaintext !== 'string') {
    return plaintext; // Return as-is if not a string
  }

  try {
    const key = getEncryptionKey();
    
    // Generate random IV and salt
    const iv = crypto.randomBytes(IV_LENGTH);
    const salt = crypto.randomBytes(SALT_LENGTH);
    
    // Derive key with salt (for additional security)
    const derivedKey = crypto.scryptSync(key, salt, KEY_LENGTH);
    
    // Create cipher
    const cipher = crypto.createCipheriv(ALGORITHM, derivedKey, iv);
    
    // Encrypt
    let encrypted = cipher.update(plaintext, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    
    // Get authentication tag
    const tag = cipher.getAuthTag();
    
    // Combine: iv:salt:tag:encryptedData
    const combined = `${iv.toString('base64')}:${salt.toString('base64')}:${tag.toString('base64')}:${encrypted}`;
    
    return combined;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

/**
 * Decrypt a string value
 * @param {string} encryptedData - The encrypted value in format: iv:salt:tag:encryptedData
 * @returns {string} Decrypted plaintext
 */
const decrypt = (encryptedData) => {
  if (!encryptedData || typeof encryptedData !== 'string') {
    return encryptedData; // Return as-is if not a string
  }

  // Check if data is already encrypted (has colons separating parts)
  if (!encryptedData.includes(':')) {
    // Not encrypted, return as-is (for backward compatibility)
    return encryptedData;
  }

  try {
    const key = getEncryptionKey();
    
    // Split the encrypted data
    const parts = encryptedData.split(':');
    if (parts.length !== 4) {
      throw new Error('Invalid encrypted data format');
    }

    const [ivBase64, saltBase64, tagBase64, encrypted] = parts;
    
    // Decode from base64
    const iv = Buffer.from(ivBase64, 'base64');
    const salt = Buffer.from(saltBase64, 'base64');
    const tag = Buffer.from(tagBase64, 'base64');
    
    // Derive key with salt
    const derivedKey = crypto.scryptSync(key, salt, KEY_LENGTH);
    
    // Create decipher
    const decipher = crypto.createDecipheriv(ALGORITHM, derivedKey, iv);
    decipher.setAuthTag(tag);
    
    // Decrypt
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    // Return original value if decryption fails (for backward compatibility)
    console.warn('Failed to decrypt, returning original value');
    return encryptedData;
  }
};

/**
 * Encrypt email address
 * @param {string} email - Email to encrypt
 * @returns {string} Encrypted email
 */
const encryptEmail = (email) => {
  if (!email) return email;
  return encrypt(email.toLowerCase().trim());
};

/**
 * Decrypt email address
 * @param {string} encryptedEmail - Encrypted email
 * @returns {string} Decrypted email
 */
const decryptEmail = (encryptedEmail) => {
  if (!encryptedEmail) return encryptedEmail;
  return decrypt(encryptedEmail);
};

/**
 * Encrypt phone number
 * @param {string} phone - Phone number to encrypt
 * @returns {string} Encrypted phone
 */
const encryptPhone = (phone) => {
  if (!phone) return phone;
  // Remove non-digit characters for consistent encryption
  const cleanedPhone = phone.replace(/\D/g, '');
  return encrypt(cleanedPhone);
};

/**
 * Decrypt phone number
 * @param {string} encryptedPhone - Encrypted phone
 * @returns {string} Decrypted phone
 */
const decryptPhone = (encryptedPhone) => {
  if (!encryptedPhone) return encryptedPhone;
  return decrypt(encryptedPhone);
};

/**
 * Check if a value is encrypted
 * @param {string} value - Value to check
 * @returns {boolean} True if encrypted
 */
const isEncrypted = (value) => {
  if (!value || typeof value !== 'string') return false;
  // Encrypted values have format: iv:salt:tag:encryptedData (4 parts separated by colons)
  return value.includes(':') && value.split(':').length === 4;
};

/**
 * Generate a secure encryption key (for setup)
 * @returns {string} Hex-encoded encryption key
 */
const generateEncryptionKey = () => {
  return crypto.randomBytes(KEY_LENGTH).toString('hex');
};

module.exports = {
  encrypt,
  decrypt,
  encryptEmail,
  decryptEmail,
  encryptPhone,
  decryptPhone,
  isEncrypted,
  generateEncryptionKey,
};

