import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlineTrash, HiOutlineRefresh } from 'react-icons/hi';
import { jobService, scraperService } from '../../services/jobService';
import Loader from '../../components/Loader';

const AdminJobs = () => {
  const [jobs, setJobs] = useState(null);
  const [scraping, setScraping] = useState(false);

  const load = async () => {
    const res = await jobService.getJobs({ limit: 50, status: '' });
    setJobs(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this job permanently?')) return;
    try {
      await jobService.deleteJob(id);
      toast.success('Job deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete job');
    }
  };

  const handleScrape = async () => {
    setScraping(true);
    try {
      const result = await scraperService.triggerScrape();
      toast.success(`Scrape complete: +${result.jobsAdded} added, ${result.duplicatesSkipped} duplicates`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Scrape failed');
    } finally {
      setScraping(false);
    }
  };

  if (!jobs) return <Loader />;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold">Manage jobs</h1>
        <button onClick={handleScrape} disabled={scraping} className="btn-primary">
          <HiOutlineRefresh className={scraping ? 'animate-spin' : ''} /> {scraping ? 'Scraping…' : 'Run scraper now'}
        </button>
      </div>

      <div className="card mt-6 divide-y divide-black/5 dark:divide-white/10">
        {jobs.map((job) => (
          <div key={job._id} className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="font-semibold">{job.title}</p>
              <p className="text-xs text-ink/50 dark:text-paper/50">
                {job.company} · {job.location} · source: {job.source}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge capitalize">{job.status}</span>
              <button onClick={() => handleDelete(job._id)} className="btn-secondary px-2.5 py-1.5 text-xs text-red-500">
                <HiOutlineTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminJobs;
