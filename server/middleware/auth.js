// Import necessary modules
const jwt = require('jsonwebtoken'); // Module for working with JSON Web Tokens

// Import constants for JWT expiration and secret
const { expiration, secret } = require('../utils/constants');

// Middleware function for authentication
module.exports = {
  authMiddleware({ req }) {
    // Extract token from request body, query parameters, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // If token is present in headers, remove 'Bearer ' prefix
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    // If no token is present, continue with the request
    if (!token) {
      return req;
    }

    try {
      // Verify the token with the secret and set a maximum age
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      // Set user data from the token to the request object
      req.user = data;
    } catch (error) {
      // Handle token errors
      if (error.name === 'TokenExpiredError') {
        console.log('Token expired');
        // Set user to null in case of expired token
        req.user = null;
      } else {
        console.log('Invalid token');
        // Set user to null in case of invalid token
        req.user = null;
      }
    }

    // Return the request object with modified or unmodified user data
    return req;
  },
};
