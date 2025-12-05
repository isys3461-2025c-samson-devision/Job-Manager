import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../auth/context/AuthContext";
import NavButton from "../../company/components/NavButtons";
// import logo from "../../../assets/dev-logo.png"; // <- you must add a logo OR replace with text

export default function CompanyHeader() {
  const navigate = useNavigate();
  const { auth, logout } = useContext(AuthContext);

  return (
    <div 
      className="d-flex justify-content-between align-items-center px-4 py-2 bg-white"
      style={{
        borderBottom: "1px solid #e5e5e5",
        position: "sticky",
        top: 0,
        zIndex: 1000
      }}
    >
      {/* LEFT — LOGO & BRAND */}
      <div className="d-flex align-items-center gap-2">
        {/* If you don’t have a logo, comment this out */}
        {/* <img src={logo} alt="Logo" style={{ width: 28, height: 28 }} /> */}

        <h5 className="fw-bold mb-0" style={{ cursor: "pointer" }} onClick={() => navigate("/dashboard")}>
          DEV<span style={{ color: "#0054FF" }}>ision</span>
        </h5>
      </div>

      {/* CENTER — NAV BUTTONS */}
      <div className="d-flex align-items-center gap-4">

        <NavButton path="/dashboard" icon="bi-house-door" label="Dashboard" />

        <NavButton path="/post-job" icon="bi-file-earmark-plus" label="Post Job" />

        <NavButton path="/applicants" icon="bi-people" label="Applicants" />

        <NavButton path="/profile" icon="bi-person" label="Profile" />

      </div>

      {/* RIGHT — USER INFO */}
      <div className="d-flex align-items-center gap-3">
        <i className="bi bi-bell" style={{ fontSize: "20px", cursor: "pointer" }}></i>

        <span className="fw-semibold">{auth?.username || "User Name"}</span>

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
