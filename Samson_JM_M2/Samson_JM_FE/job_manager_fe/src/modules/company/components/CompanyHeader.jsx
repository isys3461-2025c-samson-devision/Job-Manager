import { useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../auth/context/AuthContext";
import NavButton from "./NavButtons";

export default function CompanyHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, logout } = useContext(AuthContext);

  const isPremium = auth?.subscription === "premium";
  const dollarColor = isPremium ? "#FFD700" : "#0054FF";

  return (
    <div
      className="d-flex justify-content-between align-items-center px-4 py-2 bg-white"
      style={{
        borderBottom: "1px solid #e5e5e5",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* LEFT — LOGO */}
      <div
        className="fw-bold"
        style={{ fontSize: "20px", cursor: "pointer" }}
        onClick={() => navigate("/dashboard")}
      >
        DEV<span style={{ color: "#0054FF" }}>ision</span>
      </div>

      {/* CENTER — NAVIGATION BUTTONS */}
      <div className="d-flex align-items-center gap-3">
        <NavButton
          path="/dashboard"
          icon="bi-house-door"
          label="Dashboard"
          location={location}
        />
        <NavButton
          path="/applicants"
          icon="bi-people"
          label="Applicants"
          location={location}
        />
        <NavButton
          path="/profile"
          icon="bi-person"
          label="Profile"
          location={location}
        />
      </div>

      {/* RIGHT — ICONS */}
      <div className="d-flex align-items-center gap-3">
        {/* Subscription Indicator → now a navigation button */}
        <i
          className="bi bi-currency-dollar"
          style={{
            fontSize: "22px",
            color: dollarColor,
            cursor: "pointer",
          }}
          title={isPremium ? "Premium Subscription" : "Upgrade to Premium"}
          onClick={() => navigate("/subscription")}
        ></i>

        {/* Notifications */}
        <i
          className="bi bi-bell"
          style={{ fontSize: "20px", cursor: "pointer" }}
        />

        {/* Profile Icon */}
        <i
          className="bi bi-person-circle"
          style={{ fontSize: "22px", cursor: "pointer" }}
        />

        {/* LOG OUT BUTTON */}
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => {
            logout();
            navigate("/signin");
          }}
        >
          <i className="bi bi-box-arrow-right me-1"></i> Log Out
        </button>
      </div>
    </div>
  );
}
