import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../views/Login';
import App from '../App';

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
