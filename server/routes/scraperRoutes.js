const express = require('express');
const { scrapeJobs } = require('../controllers/scraperController');
const { protect } = require('../middlewares/auth');
const authorize = require('../middlewares/roleAuth');

const router = express.Router();

router.post('/jobs', protect, authorize('admin'), scrapeJobs);

module.exports = router;
