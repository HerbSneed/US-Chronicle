// Import dotenv to load environment variables
require("dotenv").config();

// Get JWT secret and expiration from environment variables
const secret = process.env.JWT_SECRET; // Secret key for JWT
const expiration = "2h"; // Expiration time for JWT tokens


module.exports = {
  secret,
  expiration,
};
