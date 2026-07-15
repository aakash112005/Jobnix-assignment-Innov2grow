const Application = require('../models/Application');
const Job = require('../models/Job');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const sendEmail = require('../utils/sendEmail');

// @desc    Get applications
//          - candidate: their own applications
//          - employer: applications to jobs they posted
//          - admin: all applications (optionally filtered)
// @route   GET /api/applications
// @access  Private
const getApplications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  let filter = {};

  if (req.user.role === 'candidate') {
    filter.candidate = req.user._id;
  } else if (req.user.role === 'employer') {
    const myJobs = await Job.find({ createdBy: req.user._id }).select('_id');
    filter.job = { $in: myJobs.map((j) => j._id) };
  }
  // admin: no restriction

  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const [applications, total] = await Promise.all([
    Application.find(filter)
      .populate('job', 'title company location status')
      .populate('candidate', 'name email avatar')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit)),
    Application.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: applications,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
  });
});

// @desc    Update application status (employer reviewing candidates)
// @route   PUT /api/applications/:id
// @access  Private (employer who owns the job, admin)
const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status, notes } = req.body;
  const application = await Application.findById(req.params.id)
    .populate('job')
    .populate('candidate', 'name email');

  if (!application) throw ApiError.notFound('Application not found');

  const job = application.job;
  if (req.user.role !== 'admin' && String(job.createdBy) !== String(req.user._id)) {
    throw ApiError.forbidden('You do not have permission to update this application');
  }

  if (status) application.status = status;
  if (notes !== undefined) application.notes = notes;
  await application.save();

  if (status) {
    await sendEmail({
      to: application.candidate.email,
      subject: `Application update: ${job.title}`,
      html: `<p>Hi ${application.candidate.name}, your application status for <strong>${job.title}</strong> is now: <strong>${status}</strong>.</p>`,
    });
  }

  res.status(200).json({ success: true, message: 'Application updated', data: application });
});

// @desc    Withdraw application
// @route   PUT /api/applications/:id/withdraw
// @access  Private (candidate)

const withdrawApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);

  if (!application) {
    throw ApiError.notFound("Application not found");
  }

  if (String(application.candidate) !== String(req.user._id)) {
    throw ApiError.forbidden("Not authorized");
  }

  if (application.status !== "applied") {
    throw ApiError.badRequest("Only applied applications can be withdrawn");
  }

  application.status = "withdrawn";
  await application.save();

  await Job.findByIdAndUpdate(application.job, {
    $inc: { applicantsCount: -1 },
  });

  res.status(200).json({
    success: true,
    message: "Application withdrawn",
    data: application,
  });
});

module.exports = { getApplications, updateApplicationStatus,withdrawApplication };
