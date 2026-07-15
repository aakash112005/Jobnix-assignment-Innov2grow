import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineBriefcase, HiOutlineBookmark, HiOutlineClipboardCheck } from 'react-icons/hi';
import { dashboardService } from '../../services/jobService';
import Loader from '../../components/Loader';
import PipelineTrack from '../../components/PipelineTrack';

const statusOrder = ['applied', 'under-review', 'shortlisted', 'hired'];

const CandidateDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    dashboardService.getDashboard().then(setData).catch(() => {});
  }, []);

  if (!data) return <Loader />;

  const { stats, recentApplications } = data;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Welcome back 👋</h1>
      <p className="mt-1 text-sm text-ink/60 dark:text-paper/60">Here's where your job search stands.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="card flex items-center gap-4 p-5">
          <div className="rounded-xl bg-primary-50 p-3 text-primary-500 dark:bg-primary-900/30"><HiOutlineBriefcase size={22} /></div>
          <div>
            <p className="font-display text-xl font-bold">{stats.totalApplications}</p>
            <p className="text-xs text-ink/60 dark:text-paper/60">Applications sent</p>
          </div>
        </div>
        <div className="card flex items-center gap-4 p-5">
          <div className="rounded-xl bg-accent-50 p-3 text-accent-500 dark:bg-accent-500/10"><HiOutlineBookmark size={22} /></div>
          <div>
            <p className="font-display text-xl font-bold">{stats.savedJobs}</p>
            <p className="text-xs text-ink/60 dark:text-paper/60">Saved jobs</p>
          </div>
        </div>
        <div className="card flex items-center gap-4 p-5">
          <div className="rounded-xl bg-violet-400/10 p-3 text-violet-500"><HiOutlineClipboardCheck size={22} /></div>
          <div>
            <p className="font-display text-xl font-bold">{stats.statusBreakdown?.shortlisted || 0}</p>
            <p className="text-xs text-ink/60 dark:text-paper/60">Shortlisted</p>
          </div>
        </div>
      </div>

      <div className="card mt-6 p-6">
        <h2 className="font-display font-semibold">Recent applications</h2>
        {recentApplications.length === 0 ? (
          <p className="mt-3 text-sm text-ink/60 dark:text-paper/60">
            You haven't applied to anything yet. <Link to="/jobs" className="font-semibold text-primary-500 hover:underline">Browse jobs →</Link>
          </p>
        ) : (
          <div className="mt-4 space-y-6">
            {recentApplications.map((app) => (
              <div key={app._id} className="border-b border-black/5 pb-6 last:border-0 last:pb-0 dark:border-white/10">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <Link to={`/jobs/${app.job?._id}`} className="font-semibold hover:text-primary-500">{app.job?.title}</Link>
                    <p className="text-xs text-ink/50 dark:text-paper/50">{app.job?.company}</p>
                  </div>
                  <span className="badge capitalize">{app.status}</span>
                </div>
                <div className="mt-4">
                  <PipelineTrack activeIndex={Math.max(statusOrder.indexOf(app.status), 0)} compact />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;
