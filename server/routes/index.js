const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const jobRoutes = require('./jobRoutes');
const applicationRoutes = require('./applicationRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const scraperRoutes = require('./scraperRoutes');
const companyRoutes = require('./companyRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/', userRoutes); // exposes /profile and /users under root api prefix
router.use('/jobs', jobRoutes);
router.use('/applications', applicationRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/scrape', scraperRoutes);
router.use('/companies', companyRoutes);

router.get('/health', (req, res) => res.status(200).json({ success: true, message: 'API is healthy' }));

module.exports = router;
