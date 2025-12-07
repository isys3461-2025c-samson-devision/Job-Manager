import { useNavigate } from "react-router-dom";

export default function NavButton({ path, icon, label, location }) {
  const navigate = useNavigate();
  const isActive = location.pathname === path;

  return (
    <div
      className="px-3 py-2 rounded-3 d-flex align-items-center gap-2"
      onClick={() => navigate(path)}
      style={{
        cursor: "pointer",
        background: isActive ? "rgba(0, 102, 255, 0.15)" : "transparent",
        color: isActive ? "#0066ff" : "#333",
        fontWeight: isActive ? 600 : 500,
        transition: "0.2s",
      }}
      onMouseEnter={(e) => {
        if (!isActive) e.currentTarget.style.background = "#f2f2f2";
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.background = "transparent";
      }}
    >
      <i className={`bi ${icon}`} style={{ fontSize: "16px" }}></i>
      {label}
    </div>
  );
}
