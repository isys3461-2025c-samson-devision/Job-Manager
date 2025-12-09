import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import devvisionLogo from "../../../assets/devvision-logo.png"; // add your image file here

export default function SplashScreen() {
  const navigate = useNavigate();
  const [loadingDone, setLoadingDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingDone(true);
    }, 3000); // 3-second loading

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{
        height: "100vh",
        background: "#000",
        color: "white",
        textAlign: "center",
      }}
    >
      {/* Logo */}
      <img
        src={devvisionLogo}
        alt="DEVision Logo"
        style={{ width: "160px", marginBottom: "20px" }}
      />

      {/* Team Section */}
      <div style={{ marginBottom: "40px" }}>
        <h5 style={{ fontWeight: 300, letterSpacing: "0.5px" }}>
          Squad Samson — <span style={{ fontWeight: 500 }}>Team Job Manager</span>
        </h5>
      </div>

      {/* Loading Bar */}
      {!loadingDone && (
        <div
          style={{
            width: "60%",
            height: "8px",
            background: "#222",
            borderRadius: "10px",
            overflow: "hidden",
            marginTop: "10px",
          }}
        >
          <div
            style={{
              height: "100%",
              width: "100%",
              background: "#0d6efd",
              animation: "loadingBar 3s linear forwards",
            }}
          ></div>
        </div>
      )}

      {/* Continue Button */}
      {loadingDone && (
        <button
          className="btn btn-primary mt-4 px-4 py-2"
          onClick={() => navigate("/signin")}
        >
          Continue
        </button>
      )}

      {/* Keyframe Animation */}
      <style>
        {`
          @keyframes loadingBar {
            from { width: 0%; }
            to { width: 100%; }
          }
        `}
      </style>
    </div>
  );
}
