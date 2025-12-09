import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../views/login/login';
import Register from '../views/login/resgiter';
import App from '../App';

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
