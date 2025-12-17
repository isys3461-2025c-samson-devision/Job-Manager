import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../views/login/login';
import Register from '../views/login/register';
import MainLayout from '../layouts/MainLayout';
import ProfileCreatePage from '../views/profile/createProfile';
import DashboardPage from '../views/dashboard/index';
import ProtectedRoute from './ProtectedRoute';
import ProfileUpdate from '../views/profile/updateProfile';

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      {/* Auth routes without layout */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes use MainLayout and require token */}
      <Route element={<MainLayout><ProtectedRoute /></MainLayout>}>
        <Route path="/profile" element={<ProfileUpdate/>} />
        <Route path="/profile/create" element={<ProfileCreatePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>
      
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
