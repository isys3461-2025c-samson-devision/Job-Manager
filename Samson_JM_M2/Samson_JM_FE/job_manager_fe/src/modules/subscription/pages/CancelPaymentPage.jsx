// src/modules/subscription/pages/CancelPaymentPage.jsx
import { useNavigate } from "react-router-dom";

export default function CancelPaymentPage() {
  const navigate = useNavigate();

  return (
    <div className="container text-center py-5">
      <div className="mb-4">
        <i className="bi bi-x-circle-fill text-danger" style={{ fontSize: "80px" }}></i>
      </div>

      <h2 className="fw-bold">Payment Canceled</h2>
      <p className="text-muted">
        You canceled the payment process.  
        Your subscription has not been upgraded.
      </p>

      <button
        className="btn btn-secondary mt-4 px-4"
        onClick={() => navigate("/company/subscription")}
      >
        Return to Subscription Page
      </button>
    </div>
  );
}
