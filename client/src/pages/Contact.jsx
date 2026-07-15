import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi';

const Contact = () => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 600));
    toast.success('Message sent! We\'ll get back to you within 24 hours.');
    reset();
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <span className="badge mb-4">Get in touch</span>
      <h1 className="font-display text-4xl font-bold">Contact us</h1>
      <p className="mt-3 max-w-xl text-ink/60 dark:text-paper/60">
        Questions about your account, a job posting, or a partnership? Send us a note.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-1">
          <div className="card flex items-start gap-3 p-4">
            <HiOutlineMail className="mt-0.5 text-primary-500" />
            <div>
              <p className="text-sm font-semibold">Email</p>
              <p className="text-sm text-ink/60 dark:text-paper/60">support@Jobnix.io</p>
            </div>
          </div>
          <div className="card flex items-start gap-3 p-4">
            <HiOutlinePhone className="mt-0.5 text-primary-500" />
            <div>
              <p className="text-sm font-semibold">Phone</p>
              <p className="text-sm text-ink/60 dark:text-paper/60">+91 xxxxxxxx</p>
            </div>
          </div>
          <div className="card flex items-start gap-3 p-4">
            <HiOutlineLocationMarker className="mt-0.5 text-primary-500" />
            <div>
              <p className="text-sm font-semibold">Office</p>
              <p className="text-sm text-ink/60 dark:text-paper/60">Remote-first · Global team</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4 p-6 lg:col-span-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Name</label>
              <input className="input" {...register('name', { required: 'Name is required' })} />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>
            <div>
              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>
          </div>
          <div>
            <label className="label">Subject</label>
            <input className="input" {...register('subject', { required: 'Subject is required' })} />
            {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject.message}</p>}
          </div>
          <div>
            <label className="label">Message</label>
            <textarea rows={5} className="input" {...register('message', { required: 'Message is required' })} />
            {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
          </div>
          <button disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? 'Sending…' : 'Send message'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
