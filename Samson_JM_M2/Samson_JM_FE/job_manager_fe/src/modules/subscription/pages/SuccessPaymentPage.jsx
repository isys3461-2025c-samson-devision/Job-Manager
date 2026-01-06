import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "../hooks/useSubscription";

export default function SuccessPaymentPage() {
  const navigate = useNavigate();
  const { refresh } = useSubscription();
  const redirectTimer = useRef(null);

  useEffect(() => {
    // Refresh subscription state (webhook-safe)
    refresh();

    // Auto redirect after 1.5s
    redirectTimer.current = setTimeout(() => {
      navigate("/company/dashboard");
    }, 1500);

    return () => {
      if (redirectTimer.current) {
        clearTimeout(redirectTimer.current);
      }
    };
  }, [navigate, refresh]);

  const handleGoDashboard = () => {
    if (redirectTimer.current) {
      clearTimeout(redirectTimer.current);
    }
    navigate("/company/dashboard");
  };

  return (
    <div className="container text-center py-5">
      <i
        className="bi bi-check-circle-fill text-success"
        style={{ fontSize: 80 }}
      />

      <h2 className="fw-bold mt-3">Payment Successful</h2>
      <p className="text-muted">Your subscription is now active.</p>

      <div className="mt-4">
        <button
          className="btn btn-success btn-lg px-4"
          onClick={handleGoDashboard}
        >
          Go to Company Dashboard
        </button>
      </div>

      <p className="text-muted mt-3" style={{ fontSize: "0.9rem" }}>
        You’ll be redirected automatically in a moment…
      </p>
    </div>
  );
}
