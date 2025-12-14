import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Login from '../views/login/login';
import Register from '../views/login/register';
import MainLayout from '../layouts/MainLayout';
import ProfileCreatePage from '../views/profile/create';
import DashboardPage from '../views/dashboard/index';

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      {/* Auth routes without layout */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* All other routes use MainLayout */}
      <Route element={<MainLayout><Outlet /></MainLayout>}>
        <Route path="/profile/create" element={<ProfileCreatePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>
      
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
