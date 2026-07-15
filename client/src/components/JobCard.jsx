import { Link } from 'react-router-dom';
import { HiOutlineLocationMarker, HiOutlineClock, HiOutlineBriefcase } from 'react-icons/hi';
import { motion } from 'framer-motion';

const workModeColors = {
  remote: 'bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-200',
  hybrid: 'bg-violet-400/10 text-violet-600 dark:text-violet-300',
  onsite: 'bg-accent-50 text-accent-700 dark:bg-accent-500/10 dark:text-accent-300',
};

const formatSalary = (job) => {
  if (!job.salaryMin && !job.salaryMax) return null;
  const fmt = (n) => (n >= 1000 ? `${Math.round(n / 1000)}k` : n);
  const currency = job.salaryCurrency || 'USD';
  return `${currency} ${fmt(job.salaryMin)} – ${fmt(job.salaryMax)}`;
};

const timeAgo = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 30) return `${days} days ago`;
  return new Date(date).toLocaleDateString();
};

const JobCard = ({ job }) => {
  const salary = formatSalary(job);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35 }}
      className="card group flex flex-col p-5 transition hover:shadow-lift"
    >
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-violet-500 font-display text-lg font-bold text-white">
          {job.company?.charAt(0)?.toUpperCase() || 'J'}
        </div>
        <div className="min-w-0 flex-1">
          <Link to={`/jobs/${job._id}`} className="line-clamp-1 font-display font-semibold group-hover:text-primary-500">
            {job.title}
          </Link>
          <p className="text-sm text-ink/60 dark:text-paper/60">{job.company}</p>
        </div>
        {job.source && job.source !== 'internal' && (
          <span className="badge shrink-0" title={`Sourced from ${job.source}`}>{job.source}</span>
        )}
      </div>

      <div className="mb-4 flex flex-wrap gap-2 text-xs text-ink/60 dark:text-paper/60">
        <span className="flex items-center gap-1"><HiOutlineLocationMarker /> {job.location}</span>
        <span className="flex items-center gap-1"><HiOutlineBriefcase /> {job.employmentType}</span>
        <span className="flex items-center gap-1"><HiOutlineClock /> {timeAgo(job.postedDate || job.createdAt)}</span>
      </div>

      <div className="mb-4 flex flex-wrap gap-1.5">
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${workModeColors[job.workMode] || 'badge'}`}>
          {job.workMode}
        </span>
        {(job.skills || []).slice(0, 3).map((skill) => (
          <span key={skill} className="rounded-full bg-black/5 px-2.5 py-1 font-mono text-[11px] text-ink/70 dark:bg-white/10 dark:text-paper/70">
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between pt-2">
        <span className="font-mono text-sm font-semibold text-primary-600 dark:text-primary-300">
          {salary || 'Salary not disclosed'}
        </span>
        <Link to={`/jobs/${job._id}`} className="text-sm font-semibold text-primary-500 hover:underline">
          View role →
        </Link>
      </div>
    </motion.div>
  );
};

export default JobCard;
