import { useEffect, useState } from 'react';
import { dashboardService } from '../../services/jobService';
import Loader from '../../components/Loader';

const AdminReports = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    dashboardService.getDashboard().then(setData).catch(() => {});
  }, []);

  if (!data) return <Loader />;

  const { stats, charts } = data;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Platform reports</h1>
      <p className="mt-1 text-sm text-ink/60 dark:text-paper/60">A snapshot summary you can share or export.</p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="font-display font-semibold">Platform totals</h2>
          <table className="mt-4 w-full text-sm">
            <tbody>
              {Object.entries(stats).map(([key, value]) => (
                <tr key={key} className="border-b border-black/5 last:border-0 dark:border-white/10">
                  <td className="py-2 capitalize text-ink/60 dark:text-paper/60">{key.replace(/([A-Z])/g, ' $1')}</td>
                  <td className="py-2 text-right font-mono font-semibold">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card p-6">
          <h2 className="font-display font-semibold">Top skills</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {charts.topSkills.map((s) => (
              <li key={s.skill} className="flex justify-between border-b border-black/5 pb-2 last:border-0 dark:border-white/10">
                <span>{s.skill}</span><span className="font-mono">{s.count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-6">
          <h2 className="font-display font-semibold">Top companies</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {charts.topCompanies.map((c) => (
              <li key={c.company} className="flex justify-between border-b border-black/5 pb-2 last:border-0 dark:border-white/10">
                <span>{c.company}</span><span className="font-mono">{c.count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-6">
          <h2 className="font-display font-semibold">Top locations</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {charts.topLocations.map((l) => (
              <li key={l.location} className="flex justify-between border-b border-black/5 pb-2 last:border-0 dark:border-white/10">
                <span>{l.location}</span><span className="font-mono">{l.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
