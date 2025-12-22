import { useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../auth/context/AuthContext";
import NavButton from "./NavButtons";
import NotificationModal from "./NotificationModal";
import mockNotifications from "../data/mockNotification";


export default function CompanyHeader() {
const navigate = useNavigate();
const location = useLocation();
const { auth, logout } = useContext(AuthContext);

const isPremium = auth?.subscription === "premium";
const dollarColor = isPremium ? "#FFD700" : "#0054FF";

const [openNotif, setOpenNotif] = useState(false);

const notifications = mockNotifications;


const unreadCount = notifications.filter((n) => n.unread).length;

return (
<>
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
onClick={() => navigate("/company/dashboard")}
>
DEV<span style={{ color: "#0054FF" }}>ision</span>
</div>

    {/* CENTER — NAVIGATION BUTTONS */}
    <div className="d-flex align-items-center gap-3">
      <NavButton
        path="/company/dashboard"
        icon="bi-house-door"
        label="Dashboard"
        location={location}
      />
      <NavButton
        path="/company/applicants"
        icon="bi-people"
        label="Applicants"
        location={location}
      />
      <NavButton
        path="/company/profile"
        icon="bi-person"
        label="Profile"
        location={location}
      />
    </div>

    {/* RIGHT — ICONS */}
    <div className="d-flex align-items-center gap-3">
      {/* Subscription Indicator */}
      <i
        className="bi bi-currency-dollar"
        style={{
          fontSize: "22px",
          color: dollarColor,
          cursor: "pointer",
        }}
        title={isPremium ? "Premium Subscription" : "Upgrade to Premium"}
        onClick={() => navigate("/company/subscription")}
      ></i>

      {/* Notifications (click to open modal) */}
      <div style={{ position: "relative" }}>
        <i
          className="bi bi-bell"
          style={{ fontSize: "20px", cursor: "pointer" }}
          onClick={() => setOpenNotif(true)}
          title="Notifications"
        />

        {unreadCount > 0 ? (
          <span
            style={{
              position: "absolute",
              top: -6,
              right: -8,
              minWidth: 16,
              height: 16,
              borderRadius: 999,
              backgroundColor: "#ef4444",
              color: "white",
              fontSize: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingInline: 4,
              fontWeight: 800,
              lineHeight: 1,
            }}
          >
            {unreadCount}
          </span>
        ) : null}
      </div>

      {/* LightMode/DarkMode Icon */}
      <i
        className="bi bi-sun-fill"
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

  {/* Notification Modal */}
  <NotificationModal
    open={openNotif}
    onClose={() => setOpenNotif(false)}
    items={notifications}
  />
</>


);
}