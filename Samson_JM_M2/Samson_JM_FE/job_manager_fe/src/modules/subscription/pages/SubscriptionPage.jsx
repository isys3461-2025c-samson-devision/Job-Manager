import { useNavigate } from "react-router-dom";
import CompanyHeader from "../../company/components/CompanyHeader";
import SubscriptionPlanCard from "../components/SubscriptionPlanCard";
import { useSubscription } from "../hooks/useSubscription";
import { Button } from "react-bootstrap";
import { useState } from "react";
import PaymentHistoryModal from "../components/PaymentHistoryModal";

export default function SubscriptionPage() {
  const { isPremium, loading } = useSubscription();
  const navigate = useNavigate();
  const [showPayments, setShowPayments] = useState(false);

  const FEATURES = [
    { label: "Post up to 3 job listings", free: true, premium: true },
    { label: "View applicants", free: true, premium: true },
    { label: "Basic applicant filters", free: true, premium: true },
    { label: "Standard job visibility", free: true, premium: true },
    { label: "Real-time applicant matching", free: false, premium: true },
    { label: "Advanced applicant search filters", free: false, premium: true },
    { label: "Priority job listing placement", free: false, premium: true },
    { label: "Unlimited job posts visibility", free: false, premium: true },
  ];

  if (loading) {
    return (
      <>
        <CompanyHeader />
        <div className="container py-5 text-center">
          Loading subscription...
        </div>
      </>
    );
  }

  return (
    <>
      <CompanyHeader />

      <div className="container py-5" style={{ maxWidth: "1000px" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="fw-bold mb-1">Subscription Plans</h2>
            <p className="text-muted mb-0">
              Choose the best plan for your company.
            </p>
          </div>

          <Button variant="primary" onClick={() => setShowPayments(true)}>
            <i className="bi bi-receipt me-2"></i>
            View Payment History
          </Button>
        </div>
        <div className="row g-4 mt-4">
          {/* FREE */}
          <div className="col-md-6">
            <SubscriptionPlanCard
              title="Free Plan"
              price="$0"
              description="Basic features for all companies."
              featureList={FEATURES}
              planType="FREE"
              isCurrent={!isPremium}
              buttonLabel="Free Plan"
              buttonDisabled
            />
          </div>

          {/* PREMIUM */}
          <div className="col-md-6">
            <SubscriptionPlanCard
              title="Premium Plan"
              price="$30/month"
              description="Unlock powerful hiring features."
              premium
              featureList={FEATURES}
              planType="PREMIUM"
              isCurrent={isPremium}
              buttonLabel={isPremium ? "Active" : "Upgrade to Premium"}
              buttonDisabled={isPremium}
              onButtonClick={() => navigate("/subscription/payment")}
            />
          </div>
        </div>
      </div>
      <PaymentHistoryModal
        show={showPayments}
        onHide={() => setShowPayments(false)}
      />
    </>
  );
}
