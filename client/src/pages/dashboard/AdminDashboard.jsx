import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { HiOutlineUsers, HiOutlineOfficeBuilding, HiOutlineBriefcase, HiOutlineDocumentText, HiOutlineDatabase } from 'react-icons/hi';
import { dashboardService } from '../../services/jobService';
import Loader from '../../components/Loader';

const AdminDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    dashboardService.getDashboard().then(setData).catch(() => {});
  }, []);

  if (!data) return <Loader />;

  const { stats, charts } = data;

  const cards = [
    { icon: HiOutlineUsers, label: 'Total users', value: stats.totalUsers },
    { icon: HiOutlineOfficeBuilding, label: 'Companies', value: stats.totalCompanies },
    { icon: HiOutlineBriefcase, label: 'Total jobs', value: stats.totalJobs },
    { icon: HiOutlineDocumentText, label: 'Applications', value: stats.totalApplications },
    { icon: HiOutlineDatabase, label: 'Scraped today', value: stats.jobsScrapedToday },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Platform overview</h1>
      <p className="mt-1 text-sm text-ink/60 dark:text-paper/60">Real-time stats across the whole platform.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map((c) => (
          <div key={c.label} className="card p-5">
            <c.icon className="mb-2 text-xl text-primary-500" />
            <p className="font-display text-xl font-bold">{c.value}</p>
            <p className="text-xs text-ink/60 dark:text-paper/60">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="font-display font-semibold">Top skills in demand</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.topSkills} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="skill" width={90} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#1F6F5C" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-display font-semibold">Top hiring companies</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.topCompanies} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="company" width={100} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#6C5CE7" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-display font-semibold">Top locations</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.topLocations} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="location" width={100} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#F2A93B" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-display font-semibold">User growth</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.usersOverTime}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#1F6F5C" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
