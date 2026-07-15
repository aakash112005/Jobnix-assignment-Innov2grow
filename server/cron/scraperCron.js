const cron = require('node-cron');
const { runScrape } = require('../scraper/scraperService');

// Runs every 6 hours by default (0 */6 * * *) - configurable via env.
const initScraperCron = () => {
  if (process.env.SCRAPER_CRON_ENABLED !== 'true') {
    console.log('Scraper cron disabled (SCRAPER_CRON_ENABLED != true)');
    return;
  }

  const schedule = process.env.SCRAPER_CRON_SCHEDULE || '0 */6 * * *';

  cron.schedule(schedule, async () => {
    console.log(`[cron] Running scheduled job scrape at ${new Date().toISOString()}`);
    try {
      const result = await runScrape();
      console.log(
        `[cron] Scrape complete: +${result.jobsAdded} added, ${result.duplicatesSkipped} duplicates, ${result.errors.length} errors`
      );
    } catch (err) {
      console.error('[cron] Scrape failed:', err.message);
    }
  });

  console.log(`Scraper cron scheduled: "${schedule}"`);
};

module.exports = initScraperCron;
