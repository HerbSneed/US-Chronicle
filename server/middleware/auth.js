const jwt = require('jsonwebtoken');

const { expiration, secret } = require('../utils/constants');

module.exports = {
  authMiddleware({ req }) {
    let token = req.body.token || req.query.token || req.headers.authorization;

    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      return req;
    }

    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        console.log('Token expired');
        // Optionally, you can clear the user from the request object
        req.user = null;
      } else {
        console.log('Invalid token');
        req.user = null;
      }
    }

    return req;
  },
};
