const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/user.model');
const { StatusCodes } = require('http-status-codes');

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(StatusCodes.UNAUTHORIZED);
    throw new Error('Not authorized to access this route');
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      res.status(StatusCodes.UNAUTHORIZED);
      throw new Error('User not found');
    }

    next();
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED);
    throw new Error('Not authorized to access this route');
  }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(StatusCodes.FORBIDDEN);
      throw new Error(`User role ${req.user.role} is not authorized to access this route`);
    }
    next();
  };
};