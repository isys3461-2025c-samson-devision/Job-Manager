export default function StatCard({ icon, iconColor, value, label }) {
  return (
    <div
      className="p-4 rounded-4 shadow-sm"
      style={{
        background: "#fff",
        minHeight: "150px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
      }}
    >
      {/* Icon */}
      <i
        className={`bi ${icon}`}
        style={{ fontSize: "32px", color: iconColor }}
      />

      {/* Value */}
      <h3 className="mt-3 mb-0 fw-bold">{value.toLocaleString()}</h3>

      {/* Label */}
      <p className="text-muted mb-0">{label}</p>
    </div>
  );
}
