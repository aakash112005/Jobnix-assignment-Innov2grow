import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlineMenu, HiOutlineX, HiOutlineSun, HiOutlineMoon } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { toggleTheme } from '../redux/slices/uiSlice';
import { logoutUser } from '../redux/slices/authSlice';

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition hover:text-primary-500 ${
    isActive ? 'text-primary-500' : 'text-ink/70 dark:text-paper/70'
  }`;

const dashboardPathForRole = (role) => {
  if (role === 'admin') return '/dashboard/admin';
  if (role === 'employer') return '/dashboard/employer';
  return '/dashboard/candidate';
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast.success('Logged out');
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/70 backdrop-blur-lg dark:border-white/5 dark:bg-ink/70">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-violet-500 text-white">J</span>
          Jobnix
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          <NavLink to="/" end className={navLinkClass}>Home</NavLink>
          <NavLink to="/jobs" className={navLinkClass}>Jobs</NavLink>
          <NavLink to="/about" className={navLinkClass}>About</NavLink>
          <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={() => dispatch(toggleTheme())}
            aria-label="Toggle dark mode"
            className="rounded-lg p-2 text-ink/70 transition hover:bg-black/5 dark:text-paper/70 dark:hover:bg-white/10"
          >
            {theme === 'dark' ? <HiOutlineSun size={20} /> : <HiOutlineMoon size={20} />}
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <Link to={dashboardPathForRole(user.role)} className="btn-secondary py-2 text-sm">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="btn-primary py-2 text-sm">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-secondary py-2 text-sm">Log in</Link>
              <Link to="/register" className="btn-primary py-2 text-sm">Sign up</Link>
            </div>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <HiOutlineX size={24} /> : <HiOutlineMenu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-black/5 bg-white px-4 py-4 dark:border-white/5 dark:bg-ink md:hidden">
          <div className="flex flex-col gap-4">
            <NavLink to="/" end className={navLinkClass} onClick={() => setOpen(false)}>Home</NavLink>
            <NavLink to="/jobs" className={navLinkClass} onClick={() => setOpen(false)}>Jobs</NavLink>
            <NavLink to="/about" className={navLinkClass} onClick={() => setOpen(false)}>About</NavLink>
            <NavLink to="/contact" className={navLinkClass} onClick={() => setOpen(false)}>Contact</NavLink>
            <button
              onClick={() => dispatch(toggleTheme())}
              className="flex items-center gap-2 text-sm font-medium text-ink/70 dark:text-paper/70"
            >
              {theme === 'dark' ? <HiOutlineSun size={18} /> : <HiOutlineMoon size={18} />}
              Toggle theme
            </button>
            <hr className="border-black/5 dark:border-white/10" />
            {user ? (
              <>
                <Link to={dashboardPathForRole(user.role)} className="btn-secondary text-sm" onClick={() => setOpen(false)}>Dashboard</Link>
                <button onClick={handleLogout} className="btn-primary text-sm">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm" onClick={() => setOpen(false)}>Log in</Link>
                <Link to="/register" className="btn-primary text-sm" onClick={() => setOpen(false)}>Sign up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
