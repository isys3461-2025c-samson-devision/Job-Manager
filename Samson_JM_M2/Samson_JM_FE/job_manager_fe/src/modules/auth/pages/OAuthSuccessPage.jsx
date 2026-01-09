import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function OAuthSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    const run = async () => {
      if (!token) {
        navigate("/signin", { replace: true });
        return;
      }

      // must match httpClient/localStorageUtil key
      localStorage.setItem("accessToken", token);

      // clear old cache to avoid mixing
      localStorage.removeItem("companyName");

      try {
        // fetch company profile using the token we just stored
        const res = await fetch("http://localhost:8080/api/company/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          },
        });

        if (res.ok) {
          const me = await res.json();

          // company name
          const companyName =
            me?.companyName ||
            me?.company?.name ||
            me?.company?.companyName ||
            "Company";

          localStorage.setItem("companyName", companyName);
        } else {
          localStorage.setItem("companyName", "Company");
        }
      } catch (e) {
        localStorage.setItem("companyName", "Company");
      }

      window.history.replaceState({}, document.title, "/company/dashboard");
      navigate("/company/dashboard", { replace: true });
    };

    run();
  }, [navigate, searchParams]);

  return <p>Signing you in...</p>;
}
