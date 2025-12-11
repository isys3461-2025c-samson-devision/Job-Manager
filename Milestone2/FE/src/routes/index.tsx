import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../views/login/login';
import Register from '../views/login/register';
import ProfileCreatePage from '../views/profile/create';
import DashboardPage from '../views/dashboard/index';
import App from '../App';

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile/create" element={<ProfileCreatePage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
