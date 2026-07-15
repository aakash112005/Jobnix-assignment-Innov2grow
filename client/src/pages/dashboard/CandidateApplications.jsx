import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { applicationService } from '../../services/jobService';
import Loader from '../../components/Loader';
import toast from "react-hot-toast";

const statusColors = {
  applied: 'bg-black/5 dark:bg-white/10',
  'under-review': 'bg-accent-50 text-accent-700 dark:bg-accent-500/10 dark:text-accent-300',
  shortlisted: 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-200',
  rejected: 'bg-red-50 text-red-600 dark:bg-red-900/20',
  hired: 'bg-violet-400/10 text-violet-600',
  withdrawn: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200',
};

const CandidateApplications = () => {
  const [applications, setApplications] = useState(null);

  const handleWithdraw = async (id) => {
  if (!window.confirm("Withdraw this application?")) return;

  try {
    await applicationService.withdrawApplication(id);

    toast.success("Application withdrawn");

    setApplications((prev) =>
      prev.map((app) =>
        app._id === id
          ? { ...app, status: "withdrawn" }
          : app
      )
    );
  } catch (err) {
    toast.error("Could not withdraw application");
  }
};

  useEffect(() => {
    applicationService.getApplications({ limit: 50 }).then((res) => setApplications(res.data)).catch(() => setApplications([]));
  }, []);

  if (!applications) return <Loader />;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Applied jobs</h1>
      <p className="mt-1 text-sm text-ink/60 dark:text-paper/60">Track every application you've submitted.</p>

      <div className="card mt-6 divide-y divide-black/5 dark:divide-white/10">
        {applications.length === 0 && (
          <p className="p-6 text-sm text-ink/60 dark:text-paper/60">
            No applications yet. <Link to="/jobs" className="font-semibold text-primary-500 hover:underline">Find a role →</Link>
          </p>
        )}
        {applications.map((app) => (
          <div key={app._id} className="flex flex-wrap items-center justify-between gap-3 p-5">
            <div>
              <Link to={`/jobs/${app.job?._id}`} className="font-semibold hover:text-primary-500">{app.job?.title}</Link>
              <p className="text-xs text-ink/50 dark:text-paper/50">{app.job?.company} · Applied {new Date(app.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center gap-3">
              {app.matchScore != null && (
                <span className="font-mono text-xs text-ink/50 dark:text-paper/50">Match {app.matchScore}%</span>
              )}
              <p className='text-xs font-medium capitalize'> Status : </p>
              <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusColors[app.status] || 'badge'}`}>
              {app.status}
              </span>
            </div>
            {app.status === "applied" && (
  <button
    onClick={() => handleWithdraw(app._id)}
    className="rounded bg-red-500 px-3 py-1 text-xs text-white hover:bg-red-600"
  >
    Withdraw
  </button>
)}
          </div>

        ))}
      </div>
    </div>
  );
};

export default CandidateApplications;
