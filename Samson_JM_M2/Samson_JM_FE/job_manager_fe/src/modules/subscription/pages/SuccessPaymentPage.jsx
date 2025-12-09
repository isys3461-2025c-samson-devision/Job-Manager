import { useNavigate } from "react-router-dom";

export default function SuccessPaymentPage() {
  const navigate = useNavigate();

  return (
    <div className="container text-center py-5">
      <div className="mb-4">
        <i className="bi bi-check-circle-fill text-success" style={{ fontSize: "80px" }}></i>
      </div>

      <h2 className="fw-bold">Payment Successful!</h2>
      <p className="text-muted">
        Thank you for upgrading to <strong>DEVision Premium</strong>.  
        Your subscription is now active.
      </p>

      <button
        className="btn btn-primary mt-4 px-4"
        onClick={() => navigate("/dashboard")}
      >
        Go to Dashboard
      </button>
    </div>
  );
}
