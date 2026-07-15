import { useEffect, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { bootstrapAuth } from './redux/slices/authSlice';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';

import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

import CandidateDashboard from './pages/dashboard/CandidateDashboard';
import CandidateApplications from './pages/dashboard/CandidateApplications';
import CandidateSavedJobs from './pages/dashboard/CandidateSavedJobs';
import EmployerDashboard from './pages/dashboard/EmployerDashboard';
import EmployerJobs from './pages/dashboard/EmployerJobs';
import EmployerCompany from './pages/dashboard/EmployerCompany';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import AdminUsers from './pages/dashboard/AdminUsers';
import AdminJobs from './pages/dashboard/AdminJobs';
import AdminCompanies from './pages/dashboard/AdminCompanies';
import AdminReports from './pages/dashboard/AdminReports';
import { useLocation } from "react-router-dom";


function App() {
   
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.ui);

  // Silent login on first load using the httpOnly refresh cookie
  // useEffect(() => {
  //   dispatch(bootstrapAuth());
  // }, [dispatch]);
  const didBootstrap = useRef(false);

useEffect(() => {
  if (didBootstrap.current) return;
  didBootstrap.current = true;
  dispatch(bootstrapAuth());
}, [dispatch]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <Routes>
      {/* Public routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Authenticated, role-agnostic */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Dashboards */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route element={<RoleRoute roles={['candidate']} />}>
            <Route path="/dashboard/candidate" element={<CandidateDashboard />} />
            <Route path="/dashboard/candidate/applications" element={<CandidateApplications />} />
            <Route path="/dashboard/candidate/saved" element={<CandidateSavedJobs />} />
          </Route>

          <Route element={<RoleRoute roles={['employer']} />}>
            <Route path="/dashboard/employer" element={<EmployerDashboard />} />
            <Route path="/dashboard/employer/jobs" element={<EmployerJobs />} />
            <Route path="/dashboard/employer/company" element={<EmployerCompany />} />
          </Route>

          <Route element={<RoleRoute roles={['admin']} />}>
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
            <Route path="/dashboard/admin/users" element={<AdminUsers />} />
            <Route path="/dashboard/admin/jobs" element={<AdminJobs />} />
            <Route path="/dashboard/admin/companies" element={<AdminCompanies />} />
            <Route path="/dashboard/admin/reports" element={<AdminReports />} />
          </Route>
        </Route>
      </Route>

      {/* <Route path="*" element={<MainLayout />}>
        <Route index element={<NotFound />} />
      </Route> */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
