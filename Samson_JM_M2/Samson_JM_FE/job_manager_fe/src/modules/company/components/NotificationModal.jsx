import { useEffect } from "react";
import { useNotifications } from "../../notification/context/NotificationContext";

export default function NotificationModal({ open, onClose, items = [] }) {
  const { markAsRead, markAllAsRead } = useNotifications();

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
          height: "100vh",
          backgroundColor: "#fff",
          borderLeft: "1px solid #e5e7eb",
          padding: 16,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="d-flex justify-content-between mb-2">
          <div>
            <div style={{ fontWeight: 700 }}>Notification</div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>
              Company notifications
            </div>
          </div>
          <button className="btn-close" onClick={onClose} />
        </div>

        <hr />

        <div style={{ flex: 1, overflowY: "auto" }}>
          {items.length === 0 ? (
            <div style={{ color: "#6b7280" }}>No notifications yet.</div>
          ) : (
            items.map((n) => (
              <div
                key={n.id}
                onClick={() => markAsRead(n.id)}
                style={{
                  padding: 12,
                  borderRadius: 12,
                  border: "1px solid #eef2ff",
                  background: n.read ? "#fff" : "#f8fbff",
                  marginBottom: 10,
                  cursor: "pointer",
                }}
              >
                <div className="d-flex justify-content-between">
                  <div style={{ fontWeight: 600 }}>{n.title}</div>
                  {!n.read && (
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 999,
                        backgroundColor: "#2563eb",
                      }}
                    />
                  )}
                </div>

                <div style={{ fontSize: 14, color: "#4b5563" }}>
                  {n.message}
                </div>

                <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
        <button
          className="btn w-100 mb-2"
          style={{
            background: "#e5e7eb",
            color: "#111827",
            borderRadius: 10,
            fontWeight: 600,
          }}
          onClick={markAllAsRead}
        >
          Mark all as read
        </button>

        <button
          className="btn w-100"
          style={{ background: "#64748b", color: "#fff" }}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
