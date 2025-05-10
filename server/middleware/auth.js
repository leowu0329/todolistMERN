import jwt from 'jsonwebtoken';
import { createError } from '../utils/error.js';

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    console.log('Verifying token:', token);

    if (!token) {
      return next(createError(401, 'You are not authenticated'));
    }

    const decoded = jwt.verify(token, process.env.JWT);
    console.log('Decoded token:', decoded);

    req.user = { id: decoded.id };
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    return next(createError(401, 'Invalid token'));
  }
};
