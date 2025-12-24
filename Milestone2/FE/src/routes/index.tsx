import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../views/login/login';
import Register from '../views/login/register';
import MainLayout from '../layouts/MainLayout';
import ProfileCreatePage from '../views/profile/createProfile';
import DashboardPage from '../views/dashboard/index';
import ProtectedRoute from './ProtectedRoute';
import ProfileUpdate from '../views/profile/updateProfile';
import WelcomePage from '../views/WelcomePage/welcomePage';
import JobListings from '../views/jobs/JobListings';
import JobDetails from '../views/jobs/JobDetails';

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      {/* Auth routes without layout */}
      <Route path='/' element={<WelcomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/jobs" element={<JobListings />} />
      <Route path="/jobs/:jobId" element={<JobDetails />} />

      {/* Protected routes use MainLayout and require token */}
      <Route element={<MainLayout><ProtectedRoute /></MainLayout>}>
        <Route path="/profile" element={<ProfileUpdate />} />
        <Route path="/profile/create" element={<ProfileCreatePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />

      </Route>

    </Routes>
  </BrowserRouter>
);

export default AppRouter;