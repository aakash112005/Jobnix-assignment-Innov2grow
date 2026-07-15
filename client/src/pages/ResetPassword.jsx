import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async ({ password }) => {
    if (!token) return toast.error('Missing or invalid reset token');
    try {
      await authService.resetPassword(token, password);
      toast.success('Password reset. Please log in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed. The link may have expired.');
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <div className="card p-8">
        <h1 className="font-display text-2xl font-bold">Reset password</h1>
        <p className="mt-1 text-sm text-ink/60 dark:text-paper/60">Choose a new password for your account.</p>

        {!token && (
          <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20">
            This link is missing a reset token. Please request a new one from the{' '}
            <Link to="/forgot-password" className="underline">forgot password</Link> page.
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="label">New password</label>
            <input
              type="password"
              className="input"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'At least 6 characters' },
              })}
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>
          <button disabled={isSubmitting || !token} className="btn-primary w-full">
            {isSubmitting ? 'Resetting…' : 'Reset password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
