import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [sent, setSent] = useState(false);

  const onSubmit = async ({ email }) => {
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <div className="card p-8">
        <h1 className="font-display text-2xl font-bold">Forgot password</h1>
        <p className="mt-1 text-sm text-ink/60 dark:text-paper/60">
          We'll email you a link to reset it.
        </p>

        {sent ? (
          <div className="mt-6 rounded-xl bg-primary-50 p-4 text-sm text-primary-700 dark:bg-primary-900/30 dark:text-primary-200">
            If that email is registered, a reset link is on its way. Check your inbox.
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" {...register('email', { required: 'Email is required' })} />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>
            <button disabled={isSubmitting} className="btn-primary w-full">
              {isSubmitting ? 'Sending…' : 'Send reset link'}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-ink/60 dark:text-paper/60">
          <Link to="/login" className="font-semibold text-primary-500 hover:underline">Back to login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
