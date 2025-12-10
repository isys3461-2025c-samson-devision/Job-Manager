import { useState } from "react";
import { useNavigate } from "react-router-dom";

//import { loadStripe } from "@stripe/stripe-js";

//const stripePromise = loadStripe("pk_test_xxxxxxxxx"); // your Publishable Key

export default function PaymentPage() {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const handleStripePayment = async () => {
    setLoading(true);

    // simulate Stripe redirect delay
    setTimeout(() => {
      window.location.href =
        "https://buy.stripe.com/test_8x27sK51ecaUer6cMW93y00";
    }, 1500);
  };

  // Final cancel navigation (confirmed)
  const confirmCancelPayment = () => {
    setShowModal(false);
    navigate("/subscription/payment/cancel");
  };

  return (
    <div className="container py-5 text-center">
      <h2 className="fw-bold mb-3">Upgrade to DEVision Premium</h2>
      <p className="text-muted">Secure payment is powered by Stripe</p>

      <div
        className="card shadow p-4 rounded-4 mx-auto"
        style={{ maxWidth: "450px" }}
      >
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
      {/* Cancel Button (outside card) */}
      <div className="mt-4">
        <button
          className="btn btn-outline-secondary px-4 py-2"
          onClick={() => setShowModal(true)}
          disabled={loading}
        >
          Cancel Payment
        </button>
      </div>

      {/* Cancel Payment Modal */}
      {showModal && (
        <>
          {/* Modal */}
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{
              zIndex: 2000, // modal at top
              position: "fixed",
              left: 0,
              top: 0,
              width: "100%",
              height: "100%",
            }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content p-3 rounded-4 shadow">
                <div className="modal-header">
                  <h5 className="modal-title">Cancel Payment</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>

                <div className="modal-body">
                  Are you sure you want to cancel your payment?
                </div>

                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={confirmCancelPayment}
                  >
                    Continue to Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Backdrop */}
          <div
            className="modal-backdrop fade show"
            style={{ zIndex: 1500 }} // backdrop behind modal
            onClick={() => setShowModal(false)}
          ></div>
        </>
      )}
    </div>
  );
}
