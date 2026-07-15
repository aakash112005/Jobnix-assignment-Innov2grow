const axios = require('axios');

/**
 * Remotive (https://remotive.com) publishes a free, public JSON API
 * explicitly intended for programmatic/automated consumption - no scraping
 * of HTML or ToS violation involved. Docs: https://remotive.com/api/remote-jobs
 *
 * Returns a normalized array of job objects ready for upsertJobs().
 */
const fetchRemotiveJobs = async ({ search = '', limit = 50 } = {}) => {
  const url = process.env.REMOTIVE_API_URL || 'https://remotive.com/api/remote-jobs';
  const { data } = await axios.get(url, {
    params: search ? { search, limit } : { limit },
    timeout: 15000,
  });

  const jobs = (data.jobs || []).map((job) => ({
    title: job.title,
    company: job.company_name,
    location: job.candidate_required_location || 'Remote',
    workMode: 'remote',
    employmentType: mapEmploymentType(job.job_type),
    description: stripHtml(job.description).slice(0, 5000),
    skills: extractSkills(job.tags),
    salaryMin: 0,
    salaryMax: 0,
    benefits: [],
    source: 'remotive',
    sourceUrl: job.url,
    externalId: String(job.id),
    postedDate: job.publication_date ? new Date(job.publication_date) : new Date(),
    status: 'open',
  }));

  return jobs;
};

const mapEmploymentType = (type = '') => {
  const t = type.toLowerCase();
  if (t.includes('part')) return 'part-time';
  if (t.includes('contract')) return 'contract';
  if (t.includes('intern')) return 'internship';
  if (t.includes('freelance')) return 'freelance';
  return 'full-time';
};

const extractSkills = (tags = []) => (Array.isArray(tags) ? tags.slice(0, 15) : []);

const stripHtml = (html = '') => html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

module.exports = { fetchRemotiveJobs };
