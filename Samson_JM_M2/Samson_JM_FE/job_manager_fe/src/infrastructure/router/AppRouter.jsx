import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignInPage from "../../modules/auth/pages/SignInPage";
import SignUpPage from "../../modules/auth/pages/SignUpPage";
import CompleteProfilePage from "../../modules/auth/pages/CompleteProfilePage";
import SplashScreen from "../../modules/auth/pages/SplashScreen";
import CompanyDashboard from "../../modules/company/pages/CompanyDashboard";
import CompanyApplicants from "../../modules/company/pages/CompanyApplicants";
import CompanyProfile from "../../modules/company/pages/CompanyProfile";
import SubscriptionPage from "../../modules/subscription/pages/SubscriptionPage";
import PaymentPage from "../../modules/subscription/pages/PaymentPage";
import SuccessPaymentPage from "../../modules/subscription/pages/SuccessPaymentPage";
import CancelPaymentPage from "../../modules/subscription/pages/CancelPaymentPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/oauth/complete-profile" element={<CompleteProfilePage />} />
        <Route path="/dashboard" element={<CompanyDashboard />} />
        <Route path="/applicants" element={<CompanyApplicants />} /> 
        <Route path="/profile" element={<CompanyProfile />} />
        <Route path="/subscription" element={<SubscriptionPage />} />
        <Route path="/subscription/payment" element={<PaymentPage />} />
        <Route path="/subscription/payment/success" element={<SuccessPaymentPage />} />
        <Route path="/subscription/payment/cancel" element={<CancelPaymentPage />} />
        

      </Routes>
    </BrowserRouter>
  );
}
