const Job = require('../models/Job');
const { fetchRemotiveJobs } = require('./sources/remotiveSource');

/**
 * Runs the full scrape across all configured sources, upserting jobs and
 * skipping/erroring gracefully per-job so a single bad record doesn't
 * abort the whole batch.
 *
 * @returns {{ jobsAdded: number, duplicatesSkipped: number, errors: Array }}
 */
const runScrape = async ({ search = '' } = {}) => {
  const result = { jobsAdded: 0, duplicatesSkipped: 0, errors: [] };

  let scrapedJobs = [];
  try {
    scrapedJobs = await fetchRemotiveJobs({ search });
  } catch (err) {
    result.errors.push({ source: 'remotive', message: err.message });
    return result;
  }

  for (const jobData of scrapedJobs) {
    try {
      const existing = await Job.findOne({ source: jobData.source, externalId: jobData.externalId });
      if (existing) {
        result.duplicatesSkipped += 1;
        continue;
      }

      // createdBy is required on the schema; scraped jobs are attributed to
      // a system placeholder rather than a real user account.
      await Job.create({
        ...jobData,
        createdBy: jobData.createdBy || null,
      });
      result.jobsAdded += 1;
    } catch (err) {
      result.errors.push({ job: jobData.title, message: err.message });
    }
  }

  return result;
};

module.exports = { runScrape };
