import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignInPage from "../../modules/auth/pages/SignInPage";
import SignUpPage from "../../modules/auth/pages/SignUpPage";
import FlashScreen from "../../modules/auth/pages/FlashScreen";
import HomePage from "../../modules/company/pages/HomePage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FlashScreen />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}
