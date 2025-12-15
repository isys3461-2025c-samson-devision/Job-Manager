import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function NotificationModal({ open, onClose, items = [] }) {
      const navigate = useNavigate();  
useEffect(() => {
if (!open) return;
const prev = document.body.style.overflow;
document.body.style.overflow = "hidden";
return () => {
document.body.style.overflow = prev;
};
}, [open]);

if (!open) return null;

return (
<div
onClick={onClose}
style={{
position: "fixed",
inset: 0,
backgroundColor: "rgba(0,0,0,0.25)",
zIndex: 9999,
display: "flex",
justifyContent: "flex-end",
}}
>
<div
onClick={(e) => e.stopPropagation()}
style={{
width: 360,
maxWidth: "92vw",
height: "100vh",
backgroundColor: "#ffffff",
borderLeft: "1px solid #e5e7eb",
boxShadow: "-12px 0 30px rgba(15,23,42,0.18)",
padding: 16,
display: "flex",
flexDirection: "column",
}}
>
<div className="d-flex align-items-start justify-content-between mb-2">
<div>
<div style={{ fontWeight: 700, fontSize: "1.05rem" }}>
Notification
</div>
<div style={{ fontSize: "0.82rem", color: "#6b7280" }}>
Notification for apply jobs
</div>
</div>

      <button
        type="button"
        className="btn-close"
        onClick={onClose}
        aria-label="Close"
      />
    </div>

    <hr className="my-2" />

    <div style={{ overflowY: "auto", paddingRight: 4, flex: 1 }}>
      {items.length === 0 ? (
        <div style={{ color: "#6b7280", fontSize: "0.9rem", padding: "12px 4px" }}>
          No notifications yet.
        </div>
      ) : (
        items.map((n) => (
          <div
            key={n.id}
            style={{
              padding: "10px 10px",
              borderRadius: 12,
              border: "1px solid #eef2ff",
              background: n.unread ? "#f8fbff" : "#ffffff",
              marginBottom: 10,
            }}
          >
            <div className="d-flex justify-content-between align-items-start">
              <div style={{ fontWeight: 600, fontSize: "0.92rem", color: "#111827" }}>
                {n.title}
              </div>

              {n.unread ? (
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 999,
                    backgroundColor: "#2563eb",
                    marginTop: 6,
                    flexShrink: 0,
                  }}
                />
              ) : null}
            </div>

            {n.message ? (
              <div style={{ marginTop: 4, fontSize: "0.86rem", color: "#4b5563" }}>
                {n.message}
              </div>
            ) : null}

            {n.time ? (
              <div style={{ marginTop: 6, fontSize: "0.78rem", color: "#9ca3af" }}>
                {n.time}
              </div>
            ) : null}
          </div>
        ))
      )}
    </div>

    <button
    className="btn w-100"
    style={{
        backgroundColor: "#f97316",
        color: "white",
        borderRadius: 10,
        height: 42,
        fontWeight: 600,
    }}
    onClick={() => {
        onClose();
        navigate("/signin");
    }}
    >
    Sign in
    </button>
  </div>
</div>
);
}