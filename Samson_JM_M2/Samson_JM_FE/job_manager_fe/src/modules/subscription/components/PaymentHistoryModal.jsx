import { Modal, Table, Badge, Spinner, Card } from "react-bootstrap";
import { useEffect, useState } from "react";
import { getMyPayments } from "../api/paymentApi";

export default function PaymentHistoryModal({ show, onHide }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  const total = payments.reduce((sum, p) => sum + p.amount, 0);

  useEffect(() => {
    if (!show) return;

    setLoading(true);
    getMyPayments()
      .then((res) => {
        const data = Array.isArray(res?.data) ? res.data : res;
        setPayments(Array.isArray(data) ? data : []);
      })
      .finally(() => setLoading(false));
  }, [show]);

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Payment History</Modal.Title>
      </Modal.Header>

      {/* 💳 SUMMARY CARD */}
      <div className="px-4 pt-3">
        <Card className="border-0 shadow-sm">
          <Card.Body className="d-flex justify-content-between align-items-center">
            <div>
              <div className="text-muted small">Total spent</div>
              <div className="fs-4 fw-bold">${total.toFixed(2)}</div>
            </div>

            <div className="text-end">
              <div className="text-muted small">Payments</div>
              <div className="fs-5 fw-semibold">{payments.length}</div>
            </div>
          </Card.Body>
        </Card>
      </div>

      <Modal.Body>
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" />
          </div>
        ) : payments.length === 0 ? (
          <p className="text-muted text-center">No payments found.</p>
        ) : (
          <Table striped bordered hover responsive className="mt-3">
            <thead>
              <tr>
                <th>Email</th>
                <th>Type</th>
                <th>Amount ($)</th>
                <th>Status</th>
                <th>Provider</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p, idx) => (
                <tr key={idx}>
                  <td>{p.payerEmail}</td>
                  <td>{p.payerType}</td>
                  <td>{p.amount}</td>
                  <td>
                    <Badge bg={p.status === "SUCCESS" ? "success" : "danger"}>
                      {p.status}
                    </Badge>
                  </td>
                  <td>{p.provider}</td>
                  <td>{new Date(p.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Modal.Body>
    </Modal>
  );
}
