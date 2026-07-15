import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2';
import { loginUser } from '../redux/slices/authSlice';

const dashboardPathForRole = (role) => {
  if (role === 'admin') return '/dashboard/admin';
  if (role === 'employer') return '/dashboard/employer';
  return '/dashboard/candidate';
};

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status } = useSelector((state) => state.auth);

  const onSubmit = async (values) => {
    const result = await dispatch(loginUser(values));
    if (loginUser.fulfilled.match(result)) {
      toast.success('Welcome back!');
      const from = location.state?.from?.pathname || dashboardPathForRole(result.payload.role);
      navigate(from, { replace: true });
    } else {
      toast.error(result.payload || 'Login failed');
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card p-8">
        <h1 className="font-display text-2xl font-bold">Welcome back</h1>
        <p className="mt-1 text-sm text-ink/60 dark:text-paper/60">Log in to continue your search.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              className="input"
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>
        <div>
  <label className="label">Password</label>
  <div className="relative">
    <input
      type={showPassword ? 'text' : 'password'}
      className="input pr-10"
      {...register('password', { required: 'Password is required' })}
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
          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-xs font-medium text-primary-500 hover:underline">Forgot password?</Link>
          </div>
          <button disabled={status === 'loading'} className="btn-primary w-full">
            {status === 'loading' ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink/60 dark:text-paper/60">
          Don't have an account? <Link to="/register" className="font-semibold text-primary-500 hover:underline">Sign up</Link>
        </p>

        <div className="mt-6 rounded-xl bg-black/5 p-3 text-xs text-ink/50 dark:bg-white/10 dark:text-paper/50">
          You Can Create Employer or Candidate account by Signup. <br></br>
          Demo Admin accounts: admin@jobnix.com -- password: Password123 
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
