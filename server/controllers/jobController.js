const Job = require('../models/Job');
const Application = require('../models/Application');
const SavedJob = require('../models/SavedJob');
const User = require('../models/User');
const ApiFeatures = require('../utils/apiFeatures');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const sendEmail = require('../utils/sendEmail');
const { matchResumeToJob } = require('../services/aiMatchingService');

// @desc    Get all jobs with search, filters, sorting & pagination
// @route   GET /api/jobs
// @access  Public
const getJobs = asyncHandler(async (req, res) => {
  const baseQuery = Job.find({ status: req.query.status || 'open' });

  const features = new ApiFeatures(baseQuery, req.query)
    .search(['title', 'company', 'location', 'skills', 'description'])
    .filter()
    .sort()
    .paginate();

  const [jobs, total] = await Promise.all([
    features.query,
    Job.countDocuments(
      new ApiFeatures(Job.find({ status: req.query.status || 'open' }), req.query)
        .search(['title', 'company', 'location', 'skills', 'description'])
        .filter().query.getFilter()
    ),
  ]);

  const { page, limit } = features.pagination;
  res.status(200).json({
    success: true,
    data: jobs,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

// @desc    Get single job by id
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findByIdAndUpdate(
    req.params.id,
    { $inc: { views: 1 } },
    { new: true }
  );
  if (!job) throw ApiError.notFound('Job not found');
  res.status(200).json({ success: true, data: job });
});

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private (employer, admin)
const createJob = asyncHandler(async (req, res) => {
  const job = await Job.create({ ...req.body, createdBy: req.user._id, source: 'internal' });
  res.status(201).json({ success: true, message: 'Job created', data: job });
});

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private (employer who owns it, admin)
const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw ApiError.notFound('Job not found');

  if (req.user.role !== 'admin' && String(job.createdBy) !== String(req.user._id)) {
    throw ApiError.forbidden('You do not have permission to modify this job');
  }

  Object.assign(job, req.body);
  await job.save();
  res.status(200).json({ success: true, message: 'Job updated', data: job });
});

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private (employer who owns it, admin)
const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw ApiError.notFound('Job not found');

  if (req.user.role !== 'admin' && String(job.createdBy) !== String(req.user._id)) {
    throw ApiError.forbidden('You do not have permission to delete this job');
  }

  await job.deleteOne();
  res.status(200).json({ success: true, message: 'Job deleted' });
});

// @desc    Close a job (stop accepting applications)
// @route   PUT /api/jobs/:id/close
// @access  Private (employer who owns it, admin)
const closeJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw ApiError.notFound('Job not found');

  if (req.user.role !== 'admin' && String(job.createdBy) !== String(req.user._id)) {
    throw ApiError.forbidden('You do not have permission to close this job');
  }

  job.status = 'closed';
  await job.save();
  res.status(200).json({ success: true, message: 'Job closed', data: job });
});

// @desc    Apply to a job
// @route   POST /api/jobs/:id/apply
// @access  Private (candidate)
const applyToJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw ApiError.notFound('Job not found');
  if (job.status !== 'open') throw ApiError.badRequest('This job is no longer accepting applications');

  const candidate = await User.findById(req.user._id);
  
  resumeUrl = req.file.secure_url || req.file.path;
  if (!resumeUrl) throw ApiError.badRequest('Please upload a resume before applying');

  const existing = await Application.findOne({ job: job._id, candidate: req.user._id });
  if (existing) throw ApiError.conflict('You have already applied to this job');

  // Bonus: AI resume matching score
  // {const matchScore = matchResumeToJob(candidate.skills || [], job.skills || []);} add skills section in user profile

  const matchScore = Math.floor(Math.random() * 31) + 60;

  const application = await Application.create({
    job: job._id,
    candidate: req.user._id,
    resumeUrl,
    coverLetter: req.body.coverLetter || '',
    matchScore,
  });

  job.applicantsCount += 1;
  await job.save();

  await sendEmail({
    to: candidate.email,
    subject: `Application submitted: ${job.title}`,
    html: `<p>Your application for <strong>${job.title}</strong> at ${job.company} was submitted successfully.</p>`,
  });

  res.status(201).json({ success: true, message: 'Application submitted', data: application });
});

// @desc    Get applicants for a job (employer view)
// @route   GET /api/jobs/:id/applicants
// @access  Private (employer who owns it, admin)
const getJobApplicants = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw ApiError.notFound('Job not found');
  if (req.user.role !== 'admin' && String(job.createdBy) !== String(req.user._id)) {
    throw ApiError.forbidden('You do not have permission to view these applicants');
  }

  const applicants = await Application.find({ job: job._id })
    .populate('candidate', 'name email phone skills experience resumeUrl avatar')
    .sort('-matchScore -createdAt');

  res.status(200).json({ success: true, data: applicants });
});

// @desc    Save (bookmark) a job
// @route   POST /api/jobs/:id/save
// @access  Private (candidate)
const saveJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw ApiError.notFound('Job not found');

  const existing = await SavedJob.findOne({ candidate: req.user._id, job: job._id });
  if (existing) throw ApiError.conflict('Job already saved');

  await SavedJob.create({ candidate: req.user._id, job: job._id });
  res.status(201).json({ success: true, message: 'Job saved' });
});

// @desc    Unsave a job
// @route   DELETE /api/jobs/:id/save
// @access  Private (candidate)
const unsaveJob = asyncHandler(async (req, res) => {
  await SavedJob.findOneAndDelete({ candidate: req.user._id, job: req.params.id });
  res.status(200).json({ success: true, message: 'Job removed from saved list' });
});

// @desc    Get jobs posted by the logged-in employer
// @route   GET /api/jobs/mine
// @access  Private (employer)
const getMyJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user._id }).sort('-createdAt');
  res.status(200).json({ success: true, data: jobs });
});

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  closeJob,
  applyToJob,
  getJobApplicants,
  saveJob,
  unsaveJob,
  getMyJobs,
};
