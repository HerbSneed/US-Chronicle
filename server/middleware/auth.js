// middleware/auth.js
import jwt from 'jsonwebtoken';
import { expiration, secret } from '../utils/constants.mjs';

export const authMiddleware = ({ req }) => {
  let token = req.body.token || req.query.token || req.headers.authorization;

  if (req.headers.authorization) {
    token = token.split(" ").pop().trim();
  }

  let user = null;

  if (!token) {
    return { user: null };
  }

  try {
    const { data } = jwt.verify(token, secret, { maxAge: expiration });
    user = data;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      console.log("Token expired");
    } else {
      console.log("Invalid token");
    }
    user = null;
  }

  return { user };
};
