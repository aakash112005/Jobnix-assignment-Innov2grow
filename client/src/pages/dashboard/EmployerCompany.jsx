// import { useForm } from 'react-hook-form';
// import { useEffect } from 'react';
// import toast from 'react-hot-toast';
// import { useSelector } from 'react-redux';
// import { companyService } from '../../services/jobService';

// const EmployerCompany = () => {
//   const { user } = useSelector((state) => state.auth);
//   const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

//   useEffect(() => {
//     if (user?.company) reset(user.company);
//   }, [user, reset]);

//   const onSubmit = async (values) => {
//     try {
//       await companyService.upsertMyCompany(values);
//       toast.success('Company profile saved');
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Could not save company profile');
//     }
//   };

//   return (
//     <div className="mx-auto max-w-2xl">
//       <h1 className="font-display text-2xl font-bold">Company profile</h1>
//       <p className="mt-1 text-sm text-ink/60 dark:text-paper/60">This is what candidates see on your job postings.</p>

//       <form onSubmit={handleSubmit(onSubmit)} className="card mt-6 space-y-4 p-6">
//         <div><label className="label">Company name</label><input className="input" {...register('name', { required: true })} /></div>
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//           <div><label className="label">Industry</label><input className="input" {...register('industry')} /></div>
//           <div><label className="label">Company size</label><input className="input" placeholder="e.g. 51-200" {...register('size')} /></div>
//           <div><label className="label">Location</label><input className="input" {...register('location')} /></div>
//           <div><label className="label">Website</label><input className="input" {...register('website')} /></div>
//         </div>
//         <div><label className="label">Description</label><textarea rows={4} className="input" {...register('description')} /></div>
//         <button disabled={isSubmitting} className="btn-primary">{isSubmitting ? 'Saving…' : 'Save company profile'}</button>
//       </form>
//     </div>
//   );
// };

// export default EmployerCompany;


import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import api from '../../services/api';
import { companyService } from '../../services/jobService';
import { setUser } from '../../redux/slices/authSlice';

const EmployerCompany = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();
  const [loadingCompany, setLoadingCompany] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const { data } = await api.get('/profile'); // already populates .company
        const freshUser = data.data;

        reset({
          name: freshUser.company?.name || '',
          industry: freshUser.company?.industry || '',
          size: freshUser.company?.size || '',
          location: freshUser.company?.location || '',
          website: freshUser.company?.website || '',
          description: freshUser.company?.description || '',
        });

        dispatch(setUser(freshUser)); // keep Redux in sync too
      } catch (err) {
        toast.error('Could not load company profile');
      } finally {
        setLoadingCompany(false);
      }
    };

    fetchCompany();
  }, [reset, dispatch]);

  const onSubmit = async (values) => {
    try {
      const updatedCompany = await companyService.upsertMyCompany(values);
      dispatch(setUser({ ...user, company: updatedCompany }));
      toast.success('Company profile saved');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save company profile');
    }
  };

  if (loadingCompany) {
    return <div className="mx-auto max-w-2xl py-16 text-center text-sm text-ink/50">Loading company profile…</div>;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl font-bold">Company profile</h1>
      <p className="mt-1 text-sm text-ink/60 dark:text-paper/60">This is what candidates see on your job postings.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="card mt-6 space-y-4 p-6">
        <div><label className="label">Company name</label><input className="input" {...register('name', { required: true })} /></div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div><label className="label">Industry</label><input className="input" {...register('industry')} /></div>
          <div><label className="label">Company size</label><input className="input" placeholder="e.g. 51-200" {...register('size')} /></div>
          <div><label className="label">Location</label><input className="input" {...register('location')} /></div>
          <div><label className="label">Website</label><input className="input" {...register('website')} /></div>
        </div>
        <div><label className="label">Description</label><textarea rows={4} className="input" {...register('description')} /></div>
        <button disabled={isSubmitting} className="btn-primary">{isSubmitting ? 'Saving…' : 'Save company profile'}</button>
      </form>
    </div>
  );
};

export default EmployerCompany;