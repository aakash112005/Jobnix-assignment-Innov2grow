import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2';
import { registerUser } from '../redux/slices/authSlice';
const Register = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { role: 'candidate' },
  });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector((state) => state.auth);
  const role = watch('role');

  const onSubmit = async (values) => {
    const result = await dispatch(registerUser(values));
    if (registerUser.fulfilled.match(result)) {
      toast.success('Account created!');
      navigate(result.payload.role === 'employer' ? '/dashboard/employer' : '/dashboard/candidate');
    } else {
      toast.error(result.payload || 'Registration failed');
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card p-8">
        <h1 className="font-display text-2xl font-bold">Create your account</h1>
        <p className="mt-1 text-sm text-ink/60 dark:text-paper/60">Join as a candidate or an employer.</p>

        <div className="mt-5 grid grid-cols-2 gap-2">
          {['candidate', 'employer'].map((r) => (
            <label
              key={r}
              className={`cursor-pointer rounded-xl border p-3 text-center text-sm font-medium capitalize transition ${
                role === r ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-200' : 'border-black/10 dark:border-white/15'
              }`}
            >
              <input type="radio" value={r} className="sr-only" {...register('role')} />
              {r}
            </label>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="label">Full name</label>
            <input className="input" {...register('name', { required: 'Name is required' })} />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" className="input" {...register('email', { required: 'Email is required' })} />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>
      <div>
  <label className="label">Password</label>
  <div className="relative">
    <input
      type={showPassword ? 'text' : 'password'}
      className="input pr-10"
      {...register('password', {
        required: 'Password is required',
        minLength: { value: 6, message: 'At least 6 characters' },
      })}
    />
    <button
      type="button"
      onClick={() => setShowPassword((prev) => !prev)}
      className="absolute inset-y-0 right-0 flex items-center pr-3 text-ink/50 hover:text-ink/80 dark:text-paper/50 dark:hover:text-paper/80"
      aria-label={showPassword ? 'Hide password' : 'Show password'}
      tabIndex={-1}
    >
      {showPassword ? <HiOutlineEyeSlash className="text-lg" /> : <HiOutlineEye className="text-lg" />}
    </button>
  </div>
  {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
</div>
          <button disabled={status === 'loading'} className="btn-primary w-full">
            {status === 'loading' ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink/60 dark:text-paper/60">
          Already have an account? <Link to="/login" className="font-semibold text-primary-500 hover:underline">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
