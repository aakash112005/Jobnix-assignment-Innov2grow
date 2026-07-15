import { Link } from 'react-router-dom';
import { HiOutlineArrowRight } from 'react-icons/hi';
import toast from 'react-hot-toast';

const Footer = () => {
  const handleNewsletter = (e) => {
    e.preventDefault();
    toast.success('Subscribed! Watch your inbox for new roles.');
    e.target.reset();
  };

  return (
    <footer className="border-t border-black/5 bg-white dark:border-white/5 dark:bg-ink">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-violet-500 text-white">J</span>
             Jobnix
            </Link>
            <p className="mt-3 max-w-sm text-sm text-ink/60 dark:text-paper/60">
              The AI-ready job portal connecting candidates and employers with a faster, smarter hiring pipeline.
            </p>
            <form onSubmit={handleNewsletter} className="mt-5 flex max-w-sm gap-2">
              <input type="email" required placeholder="you@email.com" className="input" />
              <button className="btn-primary shrink-0 px-3" aria-label="Subscribe">
                <HiOutlineArrowRight />
              </button>
            </form>
          </div>

          <div>
            <h4 className="mb-3 font-display text-sm font-semibold">Product</h4>
            <ul className="space-y-2 text-sm text-ink/60 dark:text-paper/60">
              <li><Link to="/jobs" className="hover:text-primary-500">Browse jobs</Link></li>
              <li><Link to="/register" className="hover:text-primary-500">Post a job</Link></li>
              <li><Link to="/about" className="hover:text-primary-500">How it works</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-display text-sm font-semibold">Company</h4>
            <ul className="space-y-2 text-sm text-ink/60 dark:text-paper/60">
              <li><Link to="/about" className="hover:text-primary-500">About us</Link></li>
              <li><Link to="/contact" className="hover:text-primary-500">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-display text-sm font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm text-ink/60 dark:text-paper/60">
              <li><span className="cursor-default">Privacy policy</span></li>
              <li><span className="cursor-default">Terms of service</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-black/5 pt-6 text-xs text-ink/50 dark:border-white/5 dark:text-paper/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Jobnix. All rights reserved.</p>
          <p>Built with the MERN stack.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
