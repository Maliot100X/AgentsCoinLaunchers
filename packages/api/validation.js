/**
 * Input Validation Utilities
 * Provides standardized validation for API inputs
 */

// Valid token statuses
const VALID_TOKEN_STATUSES = ['NEW_LAUNCH', 'PRE_GRAD', 'GRADUATED'];

// Valid sort fields
const VALID_SORT_FIELDS = ['createdAt', 'volume24h', 'holders', 'trendingScore', 'name', 'symbol'];

/**
 * Validate token status
 * @param {string} status - The status to validate
 * @returns {boolean} - True if valid
 */
function validateTokenStatus(status) {
  return VALID_TOKEN_STATUSES.includes(status);
}

/**
 * Validate sort field and direction
 * @param {string} sort - The sort string (e.g., "-createdAt" or "volume24h")
 * @returns {boolean} - True if valid
 */
function validateSortField(sort) {
  const field = sort?.replace(/^-/, '') || 'createdAt';
  return VALID_SORT_FIELDS.includes(field);
}

/**
 * Validate Solana token address
 * @param {string} address - The address to validate
 * @returns {boolean} - True if valid Solana address
 */
function validateSolanaAddress(address) {
  if (!address || typeof address !== 'string') return false;
  // Solana addresses are base58 encoded, 43-44 characters long
  const solanaAddressRegex = /^[1-9A-HJ-NP-Za-km-z]{43,44}$/;
  return solanaAddressRegex.test(address);
}

/**
 * Validate Solana token symbol
 * @param {string} symbol - The symbol to validate
 * @returns {boolean} - True if valid
 */
function validateTokenSymbol(symbol) {
  if (!symbol || typeof symbol !== 'string') return false;
  // Allow alphanumeric and common symbols, max 20 chars
  return /^[A-Z0-9\-\.]{1,20}$/.test(symbol.toUpperCase());
}

/**
 * Validate skill ID (alphanumeric with hyphens/underscores only)
 * @param {string} skillId - The skill ID to validate
 * @returns {boolean} - True if valid
 */
function validateSkillId(skillId) {
  if (!skillId || typeof skillId !== 'string') return false;
  return /^[a-zA-Z0-9_-]+$/.test(skillId);
}

/**
 * Validate integer within range
 * @param {number} value - The value to validate
 * @param {number} min - Minimum value (inclusive)
 * @param {number} max - Maximum value (inclusive)
 * @returns {boolean} - True if valid
 */
function validateNumberRange(value, min = 0, max = Infinity) {
  const num = parseInt(value, 10);
  return !isNaN(num) && num >= min && num <= max;
}

module.exports = {
  VALID_TOKEN_STATUSES,
  VALID_SORT_FIELDS,
  validateTokenStatus,
  validateSortField,
  validateSolanaAddress,
  validateTokenSymbol,
  validateSkillId,
  validateNumberRange
};
