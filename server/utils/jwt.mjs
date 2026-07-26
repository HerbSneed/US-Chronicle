// Import JWT module
import jwt from 'jsonwebtoken';


// Import JWT secret and expiration from constants
import { secret, expiration } from './constants.mjs';
console.log("🔐 JWT Secret in jwt.mjs:", secret);

// Export JWT token signing function
export const signToken = ({ email, firstName, lastName, _id }) => {
  // Create payload with user data
  const payload = { email, firstName, lastName, _id };
  // Sign JWT token with payload, secret, and expiration
  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
};
