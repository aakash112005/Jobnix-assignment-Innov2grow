const asyncHandler = require('../utils/asyncHandler');
const { runScrape } = require('../scraper/scraperService');

// @desc    Trigger a manual job scrape
// @route   POST /api/scrape/jobs
// @access  Private (admin)
const scrapeJobs = asyncHandler(async (req, res) => {
  const { search } = req.body;
  const result = await runScrape({ search });

  res.status(200).json({
    success: true,
    message: 'Scrape completed',
    data: {
      jobsAdded: result.jobsAdded,
      duplicatesSkipped: result.duplicatesSkipped,
      errors: result.errors,
    },
  });
});

module.exports = { scrapeJobs };
