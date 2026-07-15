import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { jobService } from '../../services/jobService';
import JobCard from '../../components/JobCard';
import Loader from '../../components/Loader';

const CandidateSavedJobs = () => {
  const [jobs, setJobs] = useState(null);

  const load = () => jobService.getSavedJobs().then(setJobs).catch(() => setJobs([]));

  useEffect(() => {
    load();
  }, []);

  if (!jobs) return <Loader />;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Saved jobs</h1>
      <p className="mt-1 text-sm text-ink/60 dark:text-paper/60">Your bookmarked roles, all in one place.</p>

      {jobs.length === 0 ? (
        <div className="card mt-6 p-8 text-center text-sm text-ink/60 dark:text-paper/60">
          You haven't saved any jobs yet.
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
         {jobs.filter(Boolean).map((job) => (
  <div key={job._id} className="relative">

    <JobCard job={job} />

    <button
      onClick={async () => {
        try {
          await jobService.unsaveJob(job._id);

          toast.success("Job removed from saved");

          setJobs((prev) => prev.filter((j) => j._id !== job._id));
        } catch (err) {
          toast.error("Could not remove saved job");
        }
      }}
      className="absolute right-4 top-4 rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-600"
    >
      Unsave
    </button>

  </div>
))}
        </div>
      )}
    </div>
  );
};

export default CandidateSavedJobs;
