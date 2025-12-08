import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignInPage from "../../modules/auth/pages/SignInPage";
import SignUpPage from "../../modules/auth/pages/SignUpPage";
import SplashScreen from "../../modules/auth/pages/SplashScreen";
import CompanyDashboard from "../../modules/company/pages/CompanyDashboard";
import CompanyApplicants from "../../modules/company/pages/CompanyApplicants";
import CompanyProfile from "../../modules/company/pages/CompanyProfile";
import SubscriptionPage from "../../modules/company/pages/SubscriptionPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/dashboard" element={<CompanyDashboard />} />
        <Route path="/applicants" element={<CompanyApplicants />} /> 
        <Route path="/profile" element={<CompanyProfile />} />
        <Route path="/subscription" element={<SubscriptionPage />} />
      </Routes>
    </BrowserRouter>
  );
}
