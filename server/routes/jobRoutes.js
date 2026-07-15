const express = require('express');
const {
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
} = require('../controllers/jobController');
const { protect, optionalAuth } = require('../middlewares/auth');
const authorize = require('../middlewares/roleAuth');
const upload = require('../middlewares/upload');
const { jobValidator, applyValidator } = require('../validators/jobValidator');

const router = express.Router();

router.get('/mine', protect, authorize('employer', 'admin'), getMyJobs);

router.get('/', optionalAuth, getJobs);
router.get('/:id', optionalAuth, getJobById);
router.post('/', protect, authorize('employer', 'admin'), jobValidator, createJob);
router.put('/:id', protect, authorize('employer', 'admin'), updateJob);
router.delete('/:id', protect, authorize('employer', 'admin'), deleteJob);
router.put('/:id/close', protect, authorize('employer', 'admin'), closeJob);

router.post(
  '/:id/apply',
  protect,
  authorize('candidate'),
  upload.single('resume'),
  applyValidator,
  applyToJob
);
router.get('/:id/applicants', protect, authorize('employer', 'admin'), getJobApplicants);

router.post('/:id/save', protect, authorize('candidate'), saveJob);
router.delete('/:id/save', protect, authorize('candidate'), unsaveJob);

module.exports = router;
