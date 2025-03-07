// Import dotenv to load environment variables
import 'dotenv/config';

console.log("JWT_SECRET:", process.env.JWT_SECRET);

// Get JWT secret and expiration from environment variables
export const secret = process.env.JWT_SECRET; // Secret key for JWT
export const expiration = "2h"; // Expiration time for JWT tokens
