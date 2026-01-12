import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }

    fetch(`http://localhost:8080/api/auth/verify-email?token=${token}`)
      .then(res => {
        if (!res.ok) throw new Error("Verification failed");
        return res.json();
      })
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, [token]);

  if (status === "verifying") return <p>Verifying your email...</p>;
  if (status === "success") return <p>✅ Email verified! You can now log in.</p>;
  if (status === "invalid") return <p>❌ Invalid verification link.</p>;

  return <p>❌ Verification failed or expired.</p>;
}
