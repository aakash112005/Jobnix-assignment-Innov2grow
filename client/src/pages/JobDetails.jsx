import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
  HiOutlineLocationMarker,
  HiOutlineBriefcase,
  HiOutlineCurrencyDollar,
  HiOutlineAcademicCap,
  HiOutlineBookmark,
  HiOutlineCalendar,
} from 'react-icons/hi';
import { jobService } from '../services/jobService';
import Loader from '../components/Loader';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [showApplyForm, setShowApplyForm] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await jobService.getJobById(id);
        setJob(data);
      } catch (err) {
        toast.error('Job not found');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleSave = async () => {
    if (!user) return navigate('/login');
    try {
      await jobService.saveJob(id);
      toast.success('Job saved to your bookmarks');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save job');
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    setApplying(true);
    try {
      const formData = new FormData();
      if (resumeFile) formData.append('resume', resumeFile);
      formData.append('coverLetter', coverLetter);
      await jobService.applyToJob(id, formData);
      toast.success('Application submitted!');
      setShowApplyForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <Loader fullScreen />;
  if (!job) return null;

  const salary = job.salaryMin || job.salaryMax
    ? `${job.salaryCurrency || 'USD'} ${job.salaryMin?.toLocaleString()} – ${job.salaryMax?.toLocaleString()}`
    : 'Not disclosed';

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="card p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-violet-500 font-display text-xl font-bold text-white">
              {job.company?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold sm:text-3xl">{job.title}</h1>
              <p className="mt-1 text-ink/60 dark:text-paper/60">{job.company}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="btn-secondary shrink-0"><HiOutlineBookmark /> Save</button>
            {job.status === 'open' ? (
              <button onClick={() => setShowApplyForm((s) => !s)} className="btn-primary shrink-0">Apply now</button>
            ) : (
              <span className="badge">Closed</span>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 border-y border-black/5 py-5 dark:border-white/10 sm:grid-cols-4">
          <div className="flex items-center gap-2 text-sm"><HiOutlineLocationMarker className="text-primary-500" /> {job.location}</div>
          <div className="flex items-center gap-2 text-sm capitalize"><HiOutlineBriefcase className="text-primary-500" /> {job.employmentType}</div>
          <div className="flex items-center gap-2 text-sm font-mono"><HiOutlineCurrencyDollar className="text-primary-500" /> {salary}</div>
          <div className="flex items-center gap-2 text-sm"><HiOutlineAcademicCap className="text-primary-500" /> {job.experienceMin}-{job.experienceMax} yrs</div>
        </div>

        {showApplyForm && (
          <form onSubmit={handleApply} className="mt-6 space-y-4 rounded-xl bg-primary-50 p-5 dark:bg-primary-900/20">
            <h3 className="font-display font-semibold">Apply to {job.title}</h3>
            <div>
              <label className="label">Resume (PDF/DOC, optional if one is on your profile)</label>
              <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files[0])} className="input" />
            </div>
            <div>
              <label className="label">Cover letter</label>
              <textarea rows={4} className="input" value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} />
            </div>
            <button disabled={applying} className="btn-primary">{applying ? 'Submitting…' : 'Submit application'}</button>
          </form>
        )}

        <div className="mt-8">
          <h2 className="font-display font-semibold">About the role</h2>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink/70 dark:text-paper/70">{job.description}</p>
        </div>

        {job.skills?.length > 0 && (
          <div className="mt-6">
            <h2 className="font-display font-semibold">Skills</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {job.skills.map((s) => (
                <span key={s} className="rounded-full bg-black/5 px-3 py-1 font-mono text-xs dark:bg-white/10">{s}</span>
              ))}
            </div>
          </div>
        )}

        {job.benefits?.length > 0 && (
          <div className="mt-6">
            <h2 className="font-display font-semibold">Benefits</h2>
            <ul className="mt-2 list-inside list-disc text-sm text-ink/70 dark:text-paper/70">
              {job.benefits.map((b) => <li key={b}>{b}</li>)}
            </ul>
          </div>
        )}

        {job.deadline && (
          <div className="mt-6 flex items-center gap-2 text-sm text-ink/60 dark:text-paper/60">
            <HiOutlineCalendar /> Apply before {new Date(job.deadline).toLocaleDateString()}
          </div>
        )}
      </div>

      <Link to="/jobs" className="mt-6 inline-block text-sm font-semibold text-primary-500 hover:underline">← Back to all jobs</Link>
    </div>
  );
};

export default JobDetails;
