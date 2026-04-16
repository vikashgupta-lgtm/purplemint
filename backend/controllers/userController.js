import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// @desc    Get all users (with pagination and search)
// @route   GET /api/users
// @access  Private/Admin/Manager
export const getUsers = async (req, res) => {
  const pageSize = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const roleFilter = req.query.role ? { role: req.query.role } : {};
  const statusFilter = req.query.status ? { status: req.query.status } : {};

  const filter = { ...keyword, ...roleFilter, ...statusFilter };

  const count = await User.countDocuments(filter);
  const users = await User.find(filter)
    .populate('createdBy', 'name')
    .populate('updatedBy', 'name')
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ users, page, pages: Math.ceil(count / pageSize), total: count });
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin/Manager
export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id)
    .populate('createdBy', 'name')
    .populate('updatedBy', 'name')
    .select('-password');

  if (user) {
    // Manager cannot view Admin profiles
    if (req.user.role === 'Manager' && user.role === 'Admin') {
      res.status(403).json({ message: 'Managers cannot view Admin details' });
      return;
    }
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Create a new user
// @route   POST /api/users
// @access  Private/Admin
export const createUser = async (req, res) => {
  const { name, email, password, role, status } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({ message: 'User already exists' });
    return;
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'User',
    status: status || 'active',
    createdBy: req.user._id,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin/Manager
export const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    // Managers cannot update Admins
    if (req.user.role === 'Manager' && user.role === 'Admin') {
      res.status(403).json({ message: 'Managers cannot update Admin profiles' });
      return;
    }
    
    // Managers cannot make someone an Admin
    if (req.user.role === 'Manager' && req.body.role === 'Admin') {
      res.status(403).json({ message: 'Managers cannot assign Admin roles' });
      return;
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;
    user.status = req.body.status || user.status;
    user.updatedBy = req.user._id;

    if (req.body.password) {
      user.password = req.body.password; // The pre-save hook handles hashing
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      status: updatedUser.status
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Delete (soft delete / deactivate) user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user._id.toString() === req.user._id.toString()) {
        res.status(400).json({ message: 'You cannot delete yourself' });
        return;
    }
    await User.deleteOne({ _id: user._id });
    res.json({ message: 'User removed completely' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};
