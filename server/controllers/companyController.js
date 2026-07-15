const Company = require('../models/Company');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

// @desc    Get all companies
// @route   GET /api/companies
// @access  Public
const getCompanies = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (search) filter.name = new RegExp(search, 'i');

  const skip = (Number(page) - 1) * Number(limit);
  const [companies, total] = await Promise.all([
    Company.find(filter).skip(skip).limit(Number(limit)).sort('-createdAt'),
    Company.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: companies,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
  });
});

// @desc    Get single company
// @route   GET /api/companies/:id
// @access  Public
const getCompanyById = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id) .populate("owner", "name email");
  if (!company) throw ApiError.notFound('Company not found');
  res.status(200).json({ success: true, data: company });
});

// @desc    Create / update the logged-in employer's company profile
// @route   POST /api/companies
// @access  Private (employer)
const upsertMyCompany = asyncHandler(async (req, res) => {
  const allowed = ['name', 'logo', 'website', 'industry', 'size', 'location', 'description'];
  const payload = {};
  allowed.forEach((f) => {
    if (req.body[f] !== undefined) payload[f] = req.body[f];
  });

  let company = await Company.findOne({ owner: req.user._id });
  if (company) {
    Object.assign(company, payload);
    await company.save();
  } else {
    company = await Company.create({ ...payload, owner: req.user._id });
    await User.findByIdAndUpdate(req.user._id, { company: company._id });
  }

  res.status(200).json({ success: true, message: 'Company profile saved', data: company });
});

// @desc    Delete a company (admin)
// @route   DELETE /api/companies/:id
// @access  Private (admin)
const deleteCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (!company) throw ApiError.notFound('Company not found');
  await company.deleteOne();
  res.status(200).json({ success: true, message: 'Company deleted' });
});

module.exports = { getCompanies, getCompanyById, upsertMyCompany, deleteCompany };
