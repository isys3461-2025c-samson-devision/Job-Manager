import { useState } from "react";
import { httpClient } from "../../../infrastructure/http/httpClient.js";
import { useNavigate } from "react-router-dom";

export default function PaymentPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleStripePayment = async () => {
    setLoading(true);

    const res = await httpClient.post("/api/payments/checkout", {
      payerType: "COMPANY",
      amount: 30
    });

    window.location.href = res; // Stripe Checkout URL
  };


  return (
    <div className="container py-5 text-center">
      <h2 className="fw-bold mb-3">Upgrade to DEVision Premium</h2>
      <p className="text-muted">Secure payment powered by Stripe</p>

      <div className="card shadow p-4 rounded-4 mx-auto" style={{ maxWidth: 450 }}>
        <h4>Order Summary</h4>
        <div className="d-flex justify-content-between border-bottom pb-2 mb-3">
          <span>Premium Subscription</span>
          <strong>$30/month</strong>
        </div>

        <button
          className="btn btn-primary w-100 py-2"
          onClick={handleStripePayment}
          disabled={loading}
        >
          {loading ? "Redirecting..." : "Proceed to Secure Payment"}
        </button>
      </div>

      <button
        className="btn btn-outline-secondary mt-4"
        onClick={() => navigate("/subscription/payment/cancel")}
        disabled={loading}
      >
        Cancel Payment
      </button>
    </div>
  );
}
