export default function AuthLogo() {
  return (
    <div className="text-center mb-4">
      <div 
        style={{
          width: "70px",
          height: "70px",
          borderRadius: "50%",
          backgroundColor: "#3f7cff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto",
        }}
      >
        <span style={{ fontSize: "30px", color: "white" }}>🛍️</span>
      </div>

      <h4 className="mt-3 mb-0" style={{ color: "#3f7cff", fontWeight: "600" }}>
        DEVision
      </h4>
      <p className="text-muted">Your Career Starts here</p>
    </div>
  );
}
