import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { HiOutlineBriefcase, HiOutlineUsers, HiOutlineEye } from 'react-icons/hi';
import { dashboardService } from '../../services/jobService';
import Loader from '../../components/Loader';

const COLORS = ['#1F6F5C', '#6C5CE7', '#F2A93B', '#E8921A', '#8A7CF0'];

const EmployerDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    dashboardService.getDashboard().then(setData).catch(() => {});
  }, []);

  if (!data) return <Loader />;

  const { stats, jobs } = data;
  const statusData = Object.entries(stats.statusBreakdown || {}).map(([name, value]) => ({ name, value }));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Employer overview</h1>
          <p className="mt-1 text-sm text-ink/60 dark:text-paper/60">Manage your listings and applicants.</p>
        </div>
        <Link to="/dashboard/employer/jobs?new=1" className="btn-primary">+ Post a job</Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="card flex items-center gap-4 p-5">
          <div className="rounded-xl bg-primary-50 p-3 text-primary-500 dark:bg-primary-900/30"><HiOutlineBriefcase size={22} /></div>
          <div>
            <p className="font-display text-xl font-bold">{stats.openJobs} / {stats.totalJobs}</p>
            <p className="text-xs text-ink/60 dark:text-paper/60">Open jobs</p>
          </div>
        </div>
        <div className="card flex items-center gap-4 p-5">
          <div className="rounded-xl bg-accent-50 p-3 text-accent-500 dark:bg-accent-500/10"><HiOutlineUsers size={22} /></div>
          <div>
            <p className="font-display text-xl font-bold">{stats.totalApplications}</p>
            <p className="text-xs text-ink/60 dark:text-paper/60">Total applicants</p>
          </div>
        </div>
        <div className="card flex items-center gap-4 p-5">
          <div className="rounded-xl bg-violet-400/10 p-3 text-violet-500"><HiOutlineEye size={22} /></div>
          <div>
            <p className="font-display text-xl font-bold">{stats.totalViews}</p>
            <p className="text-xs text-ink/60 dark:text-paper/60">Total job views</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="font-display font-semibold">Applicants by status</h2>
          {statusData.length === 0 ? (
            <p className="mt-4 text-sm text-ink/60 dark:text-paper/60">No applications yet.</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                    {statusData.map((entry, i) => <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="card p-6">
          <h2 className="font-display font-semibold">Your jobs</h2>
          <div className="mt-3 space-y-3">
            {jobs.slice(0, 5).map((j) => (
              <div key={j._id} className="flex items-center justify-between border-b border-black/5 pb-3 text-sm last:border-0 dark:border-white/10">
                <Link to="/dashboard/employer/jobs" className="font-medium hover:text-primary-500">{j.title}</Link>
                <span className="text-xs text-ink/50 dark:text-paper/50">{j.applicantsCount} applicants</span>
              </div>
            ))}
            {jobs.length === 0 && <p className="text-sm text-ink/60 dark:text-paper/60">No jobs posted yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
