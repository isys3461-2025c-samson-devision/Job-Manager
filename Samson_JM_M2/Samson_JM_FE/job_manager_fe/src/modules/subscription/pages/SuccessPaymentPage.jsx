import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "../hooks/useSubscription";

export default function SuccessPaymentPage() {
  const navigate = useNavigate();
  const { refresh } = useSubscription();

  useEffect(() => {
    refresh();

    const timer = setTimeout(() => {
      navigate("/company/dashboard");
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate, refresh]); // ✅ FIXED

  return (
    <div className="container text-center py-5">
      <i
        className="bi bi-check-circle-fill text-success"
        style={{ fontSize: 80 }}
      />
      <h2 className="fw-bold mt-3">Payment Successful</h2>
      <p className="text-muted">Activating your subscription...</p>
    </div>
  );
}
