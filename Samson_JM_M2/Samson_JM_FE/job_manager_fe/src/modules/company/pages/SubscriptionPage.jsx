import { useContext } from "react";
import { AuthContext } from "../../auth/context/AuthContext";
import CompanyHeader from "../components/CompanyHeader";
import SubscriptionPlanCard from "../components/SubscriptionPlanCard";

export default function SubscriptionPage() {
  const { auth, login } = useContext(AuthContext);
  const isPremium = auth?.subscription === "premium";

  const FEATURES = [
    { label: "Post up to 3 job listings", free: true, premium: true },
    { label: "View applicants", free: true, premium: true },
    { label: "Basic applicant filters", free: true, premium: true },
    { label: "Standard job visibility", free: true, premium: true },
    { label: "Real-time applicant matching", free: false, premium: true },
    { label: "Advanced applicant search filters", free: false, premium: true },
    { label: "Priority job listing placement", free: false, premium: true },
    { label: "Unlimited job posts visibility", free: false, premium: true },
    { label: "Tech background matching", free: false, premium: true },
    { label: "Education, salary, employment filters", free: false, premium: true }
  ];

  const handleUpgrade = () => {
    login({ ...auth, subscription: "premium" });
    alert("You are now subscribed to Premium!");
  };

  const handleCancel = () => {
    login({ ...auth, subscription: "free" });
    alert("Your subscription has been cancelled.");
  };

  return (
    <>
      <CompanyHeader />

      <div className="container py-5" style={{ maxWidth: "1000px" }}>
        <h2 className="fw-bold mb-2">Subscription Plans</h2>
        <p className="text-muted">Choose the best plan for your company.</p>

        <div className="row g-4 mt-4">

          {/* FREE PLAN */}
          <div className="col-md-6">
            <SubscriptionPlanCard
              title="Free Plan"
              price="$0"
              description="Basic features for all companies."
              featureList={FEATURES}
              isPremium={false}
              isCurrent={!isPremium}
              buttonLabel={!isPremium ? "Current Plan" : "Switch to Free"}
              buttonDisabled={!isPremium}
              onButtonClick={!isPremium ? null : handleCancel}
            />
          </div>

          {/* PREMIUM PLAN */}
          <div className="col-md-6">
            <SubscriptionPlanCard
              title="Premium Plan"
              price="$30/month"
              description="Unlock powerful hiring features."
              premium
              featureList={FEATURES}
              isPremium={true}
              isCurrent={isPremium}
              buttonLabel={isPremium ? "Cancel Subscription" : "Upgrade to Premium"}
              buttonDisabled={false}
              onButtonClick={isPremium ? handleCancel : handleUpgrade}
            />
          </div>

        </div>
      </div>
    </>
  );
}
