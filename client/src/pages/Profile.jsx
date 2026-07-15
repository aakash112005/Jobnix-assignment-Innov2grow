// import { useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { useSelector } from 'react-redux';
// import toast from 'react-hot-toast';
// import { HiOutlineUpload } from 'react-icons/hi';
// import api from '../services/api';

// const Profile = () => {
//   const { user } = useSelector((state) => state.auth);
//   const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();
//   const [resumeFile, setResumeFile] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [resumeUrl, setResumeUrl] = useState(user?.resumeUrl || '');

//   useEffect(() => {
//     if (user) {
//       reset({
//         name: user.name,
//         phone: user.phone,
//         bio: user.bio,
//         skills: (user.skills || []).join(', '),
//         experience: user.experience,
//       });
//       setResumeUrl(user.resumeUrl || '');
//     }
//   }, [user, reset]);

//   const onSubmit = async (values) => {
//     try {
//       await api.put('/profile', {
//         ...values,
//         skills: values.skills ? values.skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
//         experience: Number(values.experience) || 0,
//       });
//       toast.success('Profile updated');
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Update failed');
//     }
//   };

//   const handleResumeUpload = async () => {
//     if (!resumeFile) return toast.error('Choose a file first');
//     setUploading(true);
//     try {
//       const formData = new FormData();
//       formData.append('resume', resumeFile);
//       const { data } = await api.post('/profile/resume', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });
//       setResumeUrl(data.data.resumeUrl);
//       toast.success('Resume uploaded');
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Upload failed');
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="mx-auto max-w-3xl">
//       <h1 className="font-display text-2xl font-bold">Your profile</h1>
//       <p className="mt-1 text-sm text-ink/60 dark:text-paper/60">Keep your details current so employers see the real you.</p>

//       <form onSubmit={handleSubmit(onSubmit)} className="card mt-6 space-y-4 p-6">
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//           <div>
//             <label className="label">Full name</label>
//             <input className="input" {...register('name')} />
//           </div>
//           <div>
//             <label className="label">Phone</label>
//             <input className="input" {...register('phone')} />
//           </div>
//         </div>
//         <div>
//           <label className="label">Bio</label>
//           <textarea rows={3} className="input" {...register('bio')} />
//         </div>
//         {user?.role === 'candidate' && (
//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//             <div>
//               <label className="label">Skills (comma separated)</label>
//               <input className="input" {...register('skills')} />
//             </div>
//             <div>
//               <label className="label">Years of experience</label>
//               <input type="number" min="0" className="input" {...register('experience')} />
//             </div>
//           </div>
//         )}
//         <button disabled={isSubmitting} className="btn-primary">{isSubmitting ? 'Saving…' : 'Save changes'}</button>
//       </form>

//       {user?.role === 'candidate' && (
//         <div className="card mt-6 p-6">
//           <h2 className="font-display font-semibold">Resume</h2>
//           {resumeUrl && (
//             <p className="mt-1 text-sm text-primary-600 dark:text-primary-300">Current: {resumeUrl.split('/').pop()}</p>
//           )}
//           <div className="mt-3 flex flex-col gap-3 sm:flex-row">
//             <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files[0])} className="input" />
//             <button onClick={handleResumeUpload} disabled={uploading} className="btn-secondary shrink-0">
//               <HiOutlineUpload /> {uploading ? 'Uploading…' : 'Upload'}
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Profile;



import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { HiOutlineUpload } from 'react-icons/hi';
import api from '../services/api';
import { setUser } from '../redux/slices/authSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm();
  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Fetch the freshest profile data from the backend on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/profile');
        const freshUser = data.data;

        reset({
          name: freshUser.name || '',
          phone: freshUser.phone || '',
          bio: freshUser.bio || '',
          skills: (freshUser.skills || []).join(', '),
          experience: freshUser.experience ?? 0,
        });
        setResumeUrl(freshUser.resumeUrl || '');

        // Keep Redux in sync too, so other parts of the app see the latest data
        dispatch(setUser(freshUser));
      } catch (err) {
        toast.error('Could not load profile');
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [reset, dispatch]);

  const onSubmit = async (values) => {
    try {
      const { data } = await api.put('/profile', {
        ...values,
        skills: values.skills ? values.skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
        experience: Number(values.experience) || 0,
      });
      dispatch(setUser(data.data)); // keep Redux updated with the saved values
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) return toast.error('Choose a file first');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      const { data } = await api.post('/profile/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResumeUrl(data.data.resumeUrl);
      dispatch(setUser({ ...user, resumeUrl: data.data.resumeUrl }));
      toast.success('Resume uploaded');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (loadingProfile) {
    return <div className="mx-auto max-w-3xl py-16 text-center text-sm text-ink/50">Loading your profile…</div>;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-2xl font-bold">Your profile</h1>
      <p className="mt-1 text-sm text-ink/60 dark:text-paper/60">Keep your details current so employers see the real you.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="card mt-6 space-y-4 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Full name</label>
            <input className="input" {...register('name')} />
          </div>
         <div>
  <label className="label">Phone</label>
  <input
    type="tel"
    className="input"
    {...register('phone', {
      minLength: { value: 10, message: 'Phone number must be at least 10 digits' },
      pattern: { value: /^[0-9]*$/, message: 'Phone number must contain only digits' },
    })}
  />
  {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
</div>
        </div>
        <div>
          <label className="label">Bio</label>
          <textarea rows={3} className="input" {...register('bio')} />
        </div>
        {user?.role === 'candidate' && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Skills (comma separated)</label>
              <input className="input" {...register('skills')} />
            </div>
            <div>
              <label className="label">Years of experience</label>
              <input type="number" min="0" className="input" {...register('experience')} />
            </div>
          </div>
        )}
        <button disabled={isSubmitting} className="btn-primary">{isSubmitting ? 'Saving…' : 'Save changes'}</button>
      </form>

      {user?.role === 'candidate' && (
        <div className="card mt-6 p-6">
          <h2 className="font-display font-semibold">Resume</h2>
          {resumeUrl && (
            <p className="mt-1 text-sm text-primary-600 dark:text-primary-300">
              Current:{' '}
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="underline">
                {resumeUrl.split('/').pop()}
              </a>
            </p>
          )}
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files[0])} className="input" />
            <button onClick={handleResumeUpload} disabled={uploading} className="btn-secondary shrink-0">
              <HiOutlineUpload /> {uploading ? 'Uploading…' : 'Upload'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
