import { useNavigate } from "react-router-dom";

export default function CancelPaymentPage() {
  const navigate = useNavigate();

  return (
    <div className="container text-center py-5">
      <i className="bi bi-x-circle-fill text-danger" style={{ fontSize: 80 }} />
      <h2 className="fw-bold mt-3">Payment Canceled</h2>
      <p className="text-muted">Your subscription was not upgraded.</p>

      <button
        className="btn btn-secondary mt-4"
        onClick={() => navigate("/company/subscription")}
      >
        Return to Subscription Page
      </button>
    </div>
  );
}
