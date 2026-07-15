const User = require('../models/User');
const Job = require('../models/Job');
const Company = require('../models/Company');
const Application = require('../models/Application');
const SavedJob = require('../models/SavedJob');
const asyncHandler = require('../utils/asyncHandler');

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

// @desc    Get role-specific dashboard stats
// @route   GET /api/dashboard
// @access  Private
const getDashboard = asyncHandler(async (req, res) => {
  if (req.user.role === 'candidate') return sendCandidateDashboard(req, res);
  if (req.user.role === 'employer') return sendEmployerDashboard(req, res);
  return sendAdminDashboard(req, res);
});

const sendCandidateDashboard = async (req, res) => {
  const [applications, savedJobs, appliedByStatus] = await Promise.all([
    Application.find({ candidate: req.user._id }).populate('job', 'title company status').sort('-createdAt').limit(10),
    SavedJob.countDocuments({ candidate: req.user._id }),
    Application.aggregate([
      { $match: { candidate: req.user._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
  ]);

  const totalApplications = await Application.countDocuments({ candidate: req.user._id });

  res.status(200).json({
    success: true,
    data: {
      role: 'candidate',
      stats: {
        totalApplications,
        savedJobs,
        statusBreakdown: appliedByStatus.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {}),
      },
      recentApplications: applications,
    },
  });
};

const sendEmployerDashboard = async (req, res) => {
  const myJobs = await Job.find({ createdBy: req.user._id }).select('_id title status applicantsCount views');
  const jobIds = myJobs.map((j) => j._id);

  const [totalApplications, applicationsByStatus, openJobs, closedJobs] = await Promise.all([
    Application.countDocuments({ job: { $in: jobIds } }),
    Application.aggregate([
      { $match: { job: { $in: jobIds } } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Job.countDocuments({ createdBy: req.user._id, status: 'open' }),
    Job.countDocuments({ createdBy: req.user._id, status: 'closed' }),
  ]);

  res.status(200).json({
    success: true,
    data: {
      role: 'employer',
      stats: {
        totalJobs: myJobs.length,
        openJobs,
        closedJobs,
        totalApplications,
        totalViews: myJobs.reduce((sum, j) => sum + (j.views || 0), 0),
        statusBreakdown: applicationsByStatus.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {}),
      },
      jobs: myJobs,
    },
  });
};

const sendAdminDashboard = async (req, res) => {
  const [
    totalUsers,
    totalCandidates,
    totalEmployers,
    totalCompanies,
    totalJobs,
    totalApplications,
    jobsScrapedToday,
    topSkills,
    topCompanies,
    topLocations,
    usersOverTime,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'candidate' }),
    User.countDocuments({ role: 'employer' }),
    Company.countDocuments(),
    Job.countDocuments(),
    Application.countDocuments(),
    Job.countDocuments({ source: { $ne: 'internal' }, createdAt: { $gte: startOfToday() } }),
    Job.aggregate([
      { $unwind: '$skills' },
      { $group: { _id: '$skills', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
    Job.aggregate([
      { $group: { _id: '$company', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
    Job.aggregate([
      { $group: { _id: '$location', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
    User.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 30 },
    ]),
  ]);

  res.status(200).json({
    success: true,
    data: {
      role: 'admin',
      stats: {
        totalUsers,
        totalCandidates,
        totalEmployers,
        totalCompanies,
        totalJobs,
        totalApplications,
        jobsScrapedToday,
      },
      charts: {
        topSkills: topSkills.map((s) => ({ skill: s._id, count: s.count })),
        topCompanies: topCompanies.map((c) => ({ company: c._id, count: c.count })),
        topLocations: topLocations.map((l) => ({ location: l._id, count: l.count })),
        usersOverTime: usersOverTime.map((u) => ({ date: u._id, count: u.count })),
      },
    },
  });
};

module.exports = { getDashboard };
