import { useEffect, useMemo, useState } from "react";

export default function WelcomeBanner() {
  // ✅ always read from localStorage cache
  const [cachedCompanyName, setCachedCompanyName] = useState(
    () => localStorage.getItem("companyName") || "Company"
  );

  // ✅ in case companyName gets set after redirect, update once
  useEffect(() => {
    const name = localStorage.getItem("companyName");
    if (name && name !== cachedCompanyName) setCachedCompanyName(name);
  }, [cachedCompanyName]);

  const companyName = useMemo(() => {
    return cachedCompanyName || "Company";
  }, [cachedCompanyName]);

  return (
    <div
      className="p-4 rounded-4 mb-4"
      style={{
        background: "linear-gradient(90deg, #4A90E2, #357ABD)",
        color: "white",
      }}
    >
      <h3 className="fw-semibold mb-1">Welcome Back, {companyName} 👋</h3>
      <p className="mb-0" style={{ opacity: 0.9 }}>
        Here’s what’s happening with your job posts today.
      </p>
    </div>
  );
}
