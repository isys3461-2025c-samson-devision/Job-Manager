import devvisionLogo from "../../../assets/devvision-logo.png";

export default function AuthLogo() {
  return (
    <div className="text-center mb-4">
      {/* Logo */}
      <img
        src={devvisionLogo}
        alt="DevVision Logo"
        style={{
          width: "170px",
          height: "170px",
          borderRadius: "50%", // makes it circular
          objectFit: "cover",
          background: "white", // optional padding color
          padding: "10px", // optional inner spacing
        }}
      />

      {/* Team Section */}
      <div style={{ marginBottom: "40px" }}>
        <h5 style={{ fontWeight: 300, letterSpacing: "0.5px" }}>
          Squad Samson —{" "}
          <span style={{ fontWeight: 500 }}>Team Job Manager</span>
        </h5>
      </div>
    </div>
  );
}
