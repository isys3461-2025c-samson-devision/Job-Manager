export default function FlashScreen() {
  return (
    <div 
      style={{
        backgroundColor: "#3f7cff",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        color: "white"
      }}
    >
      <div 
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          backgroundColor: "rgba(255,255,255,0.25)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "20px"
        }}
      >
        <span style={{ fontSize: "40px" }}>🛍️</span>
      </div>

      <h2 className="fw-bold">DEVision</h2>
      <p>Your Dream Career</p>

      <div
        style={{
          width: "200px",
          height: "4px",
          backgroundColor: "rgba(255,255,255,0.3)",
          borderRadius: "2px",
          marginTop: "20px"
        }}
      />
    </div>
  );
}
