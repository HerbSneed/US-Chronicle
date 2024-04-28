// Import JWT module
const jwt = require('jsonwebtoken');

// Import JWT secret and expiration from constants
const { secret, expiration } = require('./constants');

// Export JWT token signing function
module.exports = {
  // Function to sign JWT token with user data
  signToken({ email, firstName, lastName, _id }) {
    // Create payload with user data
    const payload = { email, firstName, lastName, _id };
    // Sign JWT token with payload, secret, and expiration
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};