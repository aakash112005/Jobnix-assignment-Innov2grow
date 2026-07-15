const User = require('../models/User');
const SavedJob = require('../models/SavedJob');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

// @desc    Get current user's profile
// @route   GET /api/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('company');
  res.status(200).json({ success: true, data: user.toSafeObject() });
});

// @desc    Update current user's profile
// @route   PUT /api/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = ['name', 'phone', 'bio', 'skills', 'experience', 'avatar'];
  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, message: 'Profile updated', data: user.toSafeObject() });
});

// @desc    Upload / update resume
// @route   POST /api/profile/resume
// @access  Private (candidate)
// const uploadResume = asyncHandler(async (req, res) => {
//   if (!req.file) throw ApiError.badRequest('No resume file uploaded');
//   const resumeUrl = `/uploads/resumes/${req.file.filename}`;
//   const user = await User.findByIdAndUpdate(
//     req.user._id,
//     { resumeUrl },
//     { new: true }
//   );
//   res.status(200).json({ success: true, message: 'Resume uploaded', data: { resumeUrl: user.resumeUrl } });
// });

const uploadResume = asyncHandler(async (req, res) => {
  if (req.user.role !== "candidate") {
    throw ApiError.forbidden("Only candidates can upload a resume");
  }

  if (!req.file) {
    throw ApiError.badRequest("No resume file uploaded");
  }

  // File has already been uploaded by the middleware
  const resumeUrl = req.file.secure_url || req.file.path;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { resumeUrl },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Resume uploaded successfully",
    data: {
      resumeUrl: user.resumeUrl,
    },
  });
});


// @desc    Get saved (bookmarked) jobs for current candidate
// @route   GET /api/profile/saved-jobs
// @access  Private (candidate)
const getSavedJobs = asyncHandler(async (req, res) => {
  const saved = await SavedJob.find({ candidate: req.user._id }).populate('job');
  res.status(200).json({ success: true, data: saved.map((s) => s.job) });
});

// ----- Admin: user management -----

// @desc    List all users (admin)
// @route   GET /api/users
// @access  Private (admin)
const getAllUsers = asyncHandler(async (req, res) => {
  const { role, search, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (role) filter.role = role;
  if (search) filter.$or = [
    { name: new RegExp(search, 'i') },
    { email: new RegExp(search, 'i') },
  ];

  const skip = (Number(page) - 1) * Number(limit);
  const [users, total] = await Promise.all([
    User.find(filter).skip(skip).limit(Number(limit)).sort('-createdAt'),
    User.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: users.map((u) => u.toSafeObject()),
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
  });
});


// @desc    Get single user (admin)
// @route   GET /api/users/:id
// @access  Private (admin)
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).populate("company");

  if (!user) {
    throw ApiError.notFound("User not found");
  }

  res.status(200).json({
    success: true,
    data: user.toSafeObject(),
  });
});

// @desc    Delete a user (admin)
// @route   DELETE /api/users/:id
// @access  Private (admin)
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw ApiError.notFound('User not found');
  await user.deleteOne();
  res.status(200).json({ success: true, message: 'User deleted' });
});

// @desc    Toggle a user's active status (admin)
// @route   PUT /api/users/:id/status
// @access  Private (admin)
const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw ApiError.notFound('User not found');
  user.isActive = !user.isActive;
  await user.save();
  res.status(200).json({ success: true, data: user.toSafeObject() });
});

module.exports = {
  getProfile,
  updateProfile,
  uploadResume,
  getSavedJobs,
  getAllUsers,
  getUserById,
  deleteUser,
  toggleUserStatus,
};