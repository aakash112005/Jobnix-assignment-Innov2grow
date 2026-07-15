const express = require('express');
const { getApplications, updateApplicationStatus,withdrawApplication } = require('../controllers/applicationController');
const { protect } = require('../middlewares/auth');
const authorize = require('../middlewares/roleAuth');

const router = express.Router();

router.get('/', protect, getApplications);
router.put('/:id', protect, authorize('employer', 'admin'), updateApplicationStatus);
router.put(
  "/:id/withdraw",
  protect,
  authorize("candidate"), 
  withdrawApplication
);

module.exports = router;
