import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";


export default function NavButton({ path, icon, label }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isActive = pathname === path;
  const [isHover, setIsHover] = useState(false);


  return (
    <div
      onClick={() => navigate(path)}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className="d-flex align-items-center gap-2 px-3 py-1"
      style={{
        cursor: "pointer",
        borderRadius: "10px",
        backgroundColor: isActive
          ? "rgba(0, 102, 255, 0.12)"      // BLUE active
          : isHover
          ? "rgba(0, 0, 0, 0.06)"          // GRAY hover background
          : "transparent",
        color: isActive ? "#0066FF" : "#555",
        fontWeight: isActive ? "600" : "500",
        transition: "all 0.2s ease"
      }}
    >
      <i className={`bi ${icon}`} style={{ fontSize: "18px" }}></i>
      <span>{label}</span>
    </div>
  );
}
