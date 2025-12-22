import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function OAuthSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("authToken", token);
      navigate("/company/dashboard", { replace: true });
    } else {
      navigate("/signin", { replace: true });
    }
  }, [navigate, searchParams]);

  return <p>Signing you in...</p>;
}
