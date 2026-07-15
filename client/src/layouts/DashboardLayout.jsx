// import { NavLink, Outlet } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import {
//   HiOutlineViewGrid,
//   HiOutlineBriefcase,
//   HiOutlineUserCircle,
//   HiOutlineBookmark,
//   HiOutlineUsers,
//   HiOutlineOfficeBuilding,
//   HiOutlineChartBar,
// } from 'react-icons/hi';
// import Navbar from '../components/Navbar';

// const linksByRole = {
//   candidate: [
//     { to: '/dashboard/candidate', label: 'Overview', icon: HiOutlineViewGrid, end: true },
//     { to: '/dashboard/candidate/applications', label: 'Applied jobs', icon: HiOutlineBriefcase },
//     { to: '/dashboard/candidate/saved', label: 'Saved jobs', icon: HiOutlineBookmark },
//     { to: '/profile', label: 'Profile', icon: HiOutlineUserCircle },
//   ],
//   employer: [
//     { to: '/dashboard/employer', label: 'Overview', icon: HiOutlineViewGrid, end: true },
//     { to: '/dashboard/employer/jobs', label: 'My jobs', icon: HiOutlineBriefcase },
//     { to: '/dashboard/employer/company', label: 'Company profile', icon: HiOutlineOfficeBuilding },
//     { to: '/profile', label: 'Profile', icon: HiOutlineUserCircle },
//   ],
//   admin: [
//     { to: '/dashboard/admin', label: 'Overview', icon: HiOutlineViewGrid, end: true },
//     { to: '/dashboard/admin/users', label: 'Users', icon: HiOutlineUsers },
//     { to: '/dashboard/admin/jobs', label: 'Jobs', icon: HiOutlineBriefcase },
//     { to: '/dashboard/admin/companies', label: 'Companies', icon: HiOutlineOfficeBuilding },
//     { to: '/dashboard/admin/reports', label: 'Reports', icon: HiOutlineChartBar },
//   ],
// };

// const DashboardLayout = () => {
//   const { user } = useSelector((state) => state.auth);
//   const links = linksByRole[user?.role] || [];

//   return (
//     <div className="min-h-screen bg-paper dark:bg-ink">
//       <Navbar />
//       <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
//         <aside className="hidden w-56 shrink-0 md:block">
//           <nav className="card sticky top-20 flex flex-col gap-1 p-3">
//             {links.map(({ to, label, icon: Icon, end }) => (
//               <NavLink
//                 key={to}
//                 to={to}
//                 end={end}
//                 className={({ isActive }) =>
//                   `flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
//                     isActive
//                       ? 'bg-primary-500 text-white'
//                       : 'text-ink/70 hover:bg-black/5 dark:text-paper/70 dark:hover:bg-white/10'
//                   }`
//                 }
//               >
//                 <Icon size={18} />
//                 {label}
//               </NavLink>
//             ))}
//           </nav>
//         </aside>
//         <div className="min-w-0 flex-1">
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;
import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  HiOutlineViewGrid,
  HiOutlineBriefcase,
  HiOutlineUserCircle,
  HiOutlineBookmark,
  HiOutlineUsers,
  HiOutlineOfficeBuilding,
  HiOutlineChartBar,
  HiOutlineMenu,
  HiOutlineX,
} from 'react-icons/hi';
import Navbar from '../components/Navbar';

const linksByRole = {
  candidate: [
    { to: '/dashboard/candidate', label: 'Overview', icon: HiOutlineViewGrid, end: true },
    { to: '/dashboard/candidate/applications', label: 'Applied jobs', icon: HiOutlineBriefcase },
    { to: '/dashboard/candidate/saved', label: 'Saved jobs', icon: HiOutlineBookmark },
    { to: '/profile', label: 'Profile', icon: HiOutlineUserCircle },
  ],
  employer: [
    { to: '/dashboard/employer', label: 'Overview', icon: HiOutlineViewGrid, end: true },
    { to: '/dashboard/employer/jobs', label: 'My jobs', icon: HiOutlineBriefcase },
    { to: '/dashboard/employer/company', label: 'Company profile', icon: HiOutlineOfficeBuilding },
    { to: '/profile', label: 'Profile', icon: HiOutlineUserCircle },
  ],
  admin: [
    { to: '/dashboard/admin', label: 'Overview', icon: HiOutlineViewGrid, end: true },
    { to: '/dashboard/admin/users', label: 'Users', icon: HiOutlineUsers },
    { to: '/dashboard/admin/jobs', label: 'Jobs', icon: HiOutlineBriefcase },
    { to: '/dashboard/admin/companies', label: 'Companies', icon: HiOutlineOfficeBuilding },
    { to: '/dashboard/admin/reports', label: 'Reports', icon: HiOutlineChartBar },
  ],
};

const DashboardLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const links = linksByRole[user?.role] || [];
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const NavLinks = ({ onClick }) => (
    <>
      {links.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onClick}
          className={({ isActive }) =>
            `flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              isActive
                ? 'bg-primary-500 text-white'
                : 'text-ink/70 hover:bg-black/5 dark:text-paper/70 dark:hover:bg-white/10'
            }`
          }
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </>
  );

  return (
    <div className="min-h-screen bg-paper dark:bg-ink">
      <Navbar />

      {/* Mobile top bar with menu toggle */}
      <div className="flex items-center justify-between border-b border-black/5 px-4 py-3 dark:border-white/10 md:hidden">
        <span className="text-sm font-semibold text-ink dark:text-paper">Dashboard menu</span>
        <button
          onClick={() => setMobileNavOpen((prev) => !prev)}
          className="flex items-center gap-1.5 rounded-lg bg-black/5 px-3 py-2 text-sm font-medium text-ink dark:bg-white/10 dark:text-paper"
          aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileNavOpen ? <HiOutlineX size={18} /> : <HiOutlineMenu size={18} />}
          Menu
        </button>
      </div>

      {/* Mobile dropdown nav */}
      {mobileNavOpen && (
        <nav className="flex flex-col gap-1 border-b border-black/5 bg-paper p-3 dark:border-white/10 dark:bg-ink md:hidden">
          <NavLinks onClick={() => setMobileNavOpen(false)} />
        </nav>
      )}

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <aside className="hidden w-56 shrink-0 md:block">
          <nav className="card sticky top-20 flex flex-col gap-1 p-3">
            <NavLinks />
          </nav>
        </aside>
        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;