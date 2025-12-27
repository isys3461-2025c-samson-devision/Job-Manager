import { useContext } from "react";
import { AuthContext } from "../../auth/context/AuthContext";

export default function WelcomeBanner() {
  const {user} = useContext(AuthContext);

  const companyName = user?.companyName || "Company";

  return (
    <div
      className="p-4 rounded-4 mb-4"
      style={{
        background: "linear-gradient(90deg, #4A90E2, #357ABD)",
        color: "white",
      }}
    >
      <h3 className="fw-semibold mb-1">
        Welcome Back, {companyName} 👋
      </h3>
      <p className="mb-0" style={{ opacity: 0.9 }}>
        Here’s what’s happening with your job posts today.
      </p>
    </div>
  );
}
