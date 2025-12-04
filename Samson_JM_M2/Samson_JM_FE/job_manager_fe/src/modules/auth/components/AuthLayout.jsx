export default function AuthLayout({ children }) {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f7fb" }}>
      <div 
        className="d-flex flex-column justify-content-center align-items-center py-5"
        style={{ minHeight: "100vh" }}
      >
        {children}
      </div>
    </div>
  );
}
