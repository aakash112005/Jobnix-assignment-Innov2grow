const { body } = require('express-validator');
const { validate } = require('./authValidator');

const jobValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('company').trim().notEmpty().withMessage('Company is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('workMode').isIn(['remote', 'onsite', 'hybrid']).withMessage('Invalid work mode'),
  body('employmentType')
    .isIn(['full-time', 'part-time', 'contract', 'internship', 'freelance'])
    .withMessage('Invalid employment type'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('salaryMin').optional().isNumeric().withMessage('Salary min must be a number'),
  body('salaryMax').optional().isNumeric().withMessage('Salary max must be a number'),
  body('deadline').optional().isISO8601().withMessage('Deadline must be a valid date'),
  validate,
];

const applyValidator = [
  body('coverLetter').optional().isString(),
  validate,
];

module.exports = { jobValidator, applyValidator };
