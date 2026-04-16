import express from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/userController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, authorizeRoles('Admin', 'Manager'), getUsers)
  .post(protect, authorizeRoles('Admin'), createUser);

router.route('/:id')
  .get(protect, authorizeRoles('Admin', 'Manager'), getUserById)
  .put(protect, authorizeRoles('Admin', 'Manager'), updateUser)
  .delete(protect, authorizeRoles('Admin'), deleteUser);

export default router;
