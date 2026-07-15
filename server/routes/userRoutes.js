const express = require('express');
const {
  getProfile,
  updateProfile,
  uploadResume,
  getSavedJobs,
  getAllUsers,
  getUserById,
  deleteUser,
  toggleUserStatus,
} = require('../controllers/userController');
const { protect } = require('../middlewares/auth');
const authorize = require('../middlewares/roleAuth');
const upload = require('../middlewares/upload');

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/profile/resume', protect, upload.single('resume'), uploadResume);
router.get('/profile/saved-jobs', protect, getSavedJobs);

// Admin user management 
router.get('/users', protect, authorize('admin'), getAllUsers);
router.get('/users/:id', protect, authorize('admin'), getUserById);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);
router.put('/users/:id/status', protect, authorize('admin'), toggleUserStatus);

module.exports = router;
