const bcrypt = require('bcryptjs');
const { prisma } = require('../config/prisma');
const generateToken = require('../utils/generateToken');
const { sendSuccess, sendError } = require('../utils/responseHelper');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isValidEmail = (email) => emailRegex.test(email);

// @desc Register a new user
// @route POST /api/auth/register
// @access Public
const register = async (req, res, next) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return sendError(res, 'All required fields (name, email, password) must be filled', 400);
  }

  if (!isValidEmail(email)) {
    return sendError(res, 'Please provide a valid email address', 400);
  }

  if (password.length < 6) {
    return sendError(res, 'Password must be at least 6 characters long', 400);
  }

  try {
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return sendError(res, 'User already exists', 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'PATIENT'
      }
    });

    if (user) {
      generateToken(res, user.id);
      return sendSuccess(res, {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }, 'User registered successfully', 201);
    }
  } catch (error) {
    next(error);
  }
};

// @desc Login user
// @route POST /api/auth/login
// @access Public
const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendError(res, 'Please provide both email and password', 400);
  }

  if (!isValidEmail(email)) {
    return sendError(res, 'Please provide a valid email address', 400);
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      generateToken(res, user.id);
      return sendSuccess(res, {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }, 'Login successful');
    } else {
      return sendError(res, 'Invalid email or password', 401);
    }
  } catch (error) {
    next(error);
  }
};

// @desc Get current user profile
// @route GET /api/auth/me
// @access Private
const getMe = async (req, res, next) => {
  return sendSuccess(res, req.user, 'Profile retrieved successfully');
};

// @desc Logout user / clear cookie
// @route POST /api/auth/logout
// @access Private
const logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  return sendSuccess(res, null, 'Logged out successfully');
};

module.exports = { register, login, getMe, logout };
