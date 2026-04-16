import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes
export const protect = async (req, res, next) => {
  let token;

  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret123');
      req.user = await User.findById(decoded.userId).select('-password');
      
      if (!req.user || req.user.status === 'inactive') {
        res.status(401).json({ message: 'Not authorized, user inactive or not found' });
        return;
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Generic role authorization
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ 
        message: `Role (${req.user ? req.user.role : 'none'}) is not allowed to access this resource` 
      });
      return;
    }
    next();
  };
};
