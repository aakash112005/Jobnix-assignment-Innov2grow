import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { HiOutlinePencil, HiOutlineTrash, HiOutlineLockClosed, HiOutlineUsers, HiOutlineX } from 'react-icons/hi';
import { jobService ,applicationService} from '../../services/jobService';
import Loader from '../../components/Loader';




const emptyDefaults = {
  title: '', company: '', location: '', workMode: 'remote', employmentType: 'full-time',
  salaryMin: '', salaryMax: '', experienceMin: '', experienceMax: '',
  skills: '', description: '', benefits: '', deadline: '',
};

const EmployerJobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [showForm, setShowForm] = useState(searchParams.get('new') === '1');
  const [applicantsFor, setApplicantsFor] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({ defaultValues: emptyDefaults });

  const load = () => jobService.getMyJobs().then(setJobs).catch(() => setJobs([]));

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditingJob(null);
    reset(emptyDefaults);
    setShowForm(true);
  };

  const openEdit = (job) => {
    setEditingJob(job);
    reset({
      ...job,
      skills: (job.skills || []).join(', '),
      benefits: (job.benefits || []).join(', '),
      deadline: job.deadline ? job.deadline.slice(0, 10) : '',
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setSearchParams({});
  };

  const onSubmit = async (values) => {
    const payload = {
      ...values,
      salaryMin: Number(values.salaryMin) || 0,
      salaryMax: Number(values.salaryMax) || 0,
      experienceMin: Number(values.experienceMin) || 0,
      experienceMax: Number(values.experienceMax) || 0,
      skills: values.skills ? values.skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
      benefits: values.benefits ? values.benefits.split(',').map((s) => s.trim()).filter(Boolean) : [],
      deadline: values.deadline || undefined,
    };
    try {
      if (editingJob) {
        await jobService.updateJob(editingJob._id, payload);
        toast.success('Job updated');
      } else {
        await jobService.createJob(payload);
        toast.success('Job posted');
      }
      closeForm();
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save job');
    }
  };

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

  const handleClose = async (id) => {
    try {
      await jobService.closeJob(id);
      toast.success('Job closed');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not close job');
    }
  };

  const viewApplicants = async (job) => {
    setApplicantsFor(job);
    try {
      const data = await jobService.getApplicants(job._id);
      setApplicants(data);
    } catch (err) {
      toast.error('Could not load applicants');
    }
  };


  const STATUS_OPTIONS = ['applied', 'under-review', 'shortlisted', 'rejected', 'hired'];

const handleStatusChange = async (applicationId, newStatus) => {
  const prev = applicants;
  // optimistic update
  setApplicants((list) =>
    list.map((a) => (a._id === applicationId ? { ...a, status: newStatus } : a))
  );
  try {
    await applicationService.updateStatus(applicationId, { status: newStatus });
    toast.success('Status updated');
  } catch (err) {
    setApplicants(prev); // revert on failure
    toast.error(err.response?.data?.message || 'Could not update status');
  }
};

  if (!jobs) return <Loader />;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold">My jobs</h1>
        <button onClick={openCreate} className="btn-primary">+ Post a job</button> 
      </div>

      <div className="card mt-6 divide-y divide-black/5 dark:divide-white/10">
        {jobs.length === 0 && <p className="p-6 text-sm text-ink/60 dark:text-paper/60">You haven't posted any jobs yet.</p>}
        {jobs.map((job) => (
          <div key={job._id} className="flex flex-wrap items-center justify-between gap-3 p-5">
            <div>
              <p className="font-semibold">{job.title}</p>
              <p className="text-xs text-ink/50 dark:text-paper/50">
                {job.location} · {job.applicantsCount} applicants · {job.views} views
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`badge capitalize ${job.status === 'closed' ? '!bg-black/10 !text-ink/50 dark:!bg-white/10' : ''}`}>{job.status}</span>
              <button onClick={() => viewApplicants(job)} className="btn-secondary px-2.5 py-1.5 text-xs"><HiOutlineUsers /></button>
              <button onClick={() => openEdit(job)} className="btn-secondary px-2.5 py-1.5 text-xs"><HiOutlinePencil /></button>
              {job.status === 'open' && (
                <button onClick={() => handleClose(job._id)} className="btn-secondary px-2.5 py-1.5 text-xs"><HiOutlineLockClosed /></button>
              )}
              <button onClick={() => handleDelete(job._id)} className="btn-secondary px-2.5 py-1.5 text-xs text-red-500"><HiOutlineTrash /></button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={closeForm}>
          <div className="card max-h-[90vh] w-full max-w-2xl overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">{editingJob ? 'Edit job' : 'Post a new job'}</h2>
              <button onClick={closeForm}><HiOutlineX /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div><label className="label">Title</label><input className="input" {...register('title', { required: true })} /></div>
                <div><label className="label">Company</label><input className="input" {...register('company', { required: true })} /></div>
                <div><label className="label">Location</label><input className="input" {...register('location', { required: true })} /></div>
                <div>
                  <label className="label">Work mode</label>
                  <select className="input" {...register('workMode')}>
                    <option value="remote">Remote</option><option value="onsite">Onsite</option><option value="hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="label">Employment type</label>
                  <select className="input" {...register('employmentType')}>
                    <option value="full-time">Full-time</option><option value="part-time">Part-time</option>
                    <option value="contract">Contract</option><option value="internship">Internship</option>
                    <option value="freelance">Freelance</option>
                  </select>
                </div>
                <div><label className="label">Deadline</label><input type="date" className="input" {...register('deadline')} /></div>
                <div><label className="label">Salary min</label><input type="number" className="input" {...register('salaryMin')} /></div>
                <div><label className="label">Salary max</label><input type="number" className="input" {...register('salaryMax')} /></div>
                <div><label className="label">Experience min (yrs)</label><input type="number" className="input" {...register('experienceMin')} /></div>
                <div><label className="label">Experience max (yrs)</label><input type="number" className="input" {...register('experienceMax')} /></div>
              </div>
              <div><label className="label">Skills (comma separated)</label><input className="input" {...register('skills')} /></div>
              <div><label className="label">Benefits (comma separated)</label><input className="input" {...register('benefits')} /></div>
              <div><label className="label">Description</label><textarea rows={5} className="input" {...register('description', { required: true })} /></div>
              <button disabled={isSubmitting} className="btn-primary w-full">{isSubmitting ? 'Saving…' : 'Save job'}</button>
            </form>
          </div>
        </div>
      )}

      {applicantsFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setApplicantsFor(null)}>
          <div className="card max-h-[90vh] w-full max-w-2xl overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">Applicants — {applicantsFor.title}</h2>
              <button onClick={() => setApplicantsFor(null)}><HiOutlineX /></button>
            </div>
            {applicants.length === 0 ? (
              <p className="text-sm text-ink/60 dark:text-paper/60">No applicants yet.</p>
            ) : (
              <div className="space-y-3">
              {applicants.map((a) => (
  <div key={a._id} className="flex items-center justify-between rounded-xl border border-black/5 p-4 dark:border-white/10">
    <div>
      <p className="font-semibold">{a.candidate?.name}</p>
      <p className="text-xs text-ink/50 dark:text-paper/50">{a.candidate?.email}</p>
    </div>
    <div className="flex items-center gap-3">
      {a.matchScore != null && (
        <span className="font-mono text-xs text-primary-600 dark:text-primary-300">{a.matchScore}% match</span>
      )}
      <a href={a.resumeUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-primary-500 hover:underline">
        Resume
      </a>

      {/* Current status — read only */}
      <span className="badge capitalize">{a.status}</span>

      {/* Change status — separate control */}
      <select
        value=""
        onChange={(e) => {
          if (e.target.value) handleStatusChange(a._id, e.target.value);
        }}
        className="input !w-auto py-1 px-2 text-xs"
      >
        <option value="" disabled>Change status</option>
        {STATUS_OPTIONS.filter((s) => s !== a.status).map((s) => (
          <option key={s} value={s} className="capitalize">{s}</option>
        ))}
      </select>
    </div>
  </div>
))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerJobs;
