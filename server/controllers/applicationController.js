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
      subject: `Application Update: ${job.title}`,
html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1f2937;">
    <div style="text-align: center; margin-bottom: 24px;">
      <h1 style="color: #2563eb; margin: 0;">Job Nix</h1>
    </div>

    <h2 style="color: #111827;">Application Status Update</h2>

    <p style="font-size: 15px; line-height: 1.6;">
      Hi ${application.candidate.name},
    </p>

    <p style="font-size: 15px; line-height: 1.6;">
      There's an update on your application for <strong>${job.title}</strong> at <strong>${job.company}</strong>.
    </p>

    <div style="text-align: center; margin: 24px 0;">
      <span style="display: inline-block; background-color: #eff6ff; color: #2563eb; font-weight: bold; font-size: 14px; text-transform: capitalize; padding: 8px 20px; border-radius: 999px;">
        ${status}
      </span>
    </div>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${process.env.CLIENT_URL}/dashboard/applications"
         style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-weight: bold; display: inline-block;">
        View Application Details
      </a>
    </div>

    <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">
      If you have any questions about this update, feel free to reply to this email.
    </p>

    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />

    <p style="font-size: 12px; color: #9ca3af; text-align: center;">
      © ${new Date().getFullYear()} Job Nix. All rights reserved.
    </p>
  </div>
`,
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
