import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function probe(url, token) {
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.status; // 200/204/401/403...
  } catch {
    return 0; // network error
  }
}

export default function OAuthSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [text, setText] = useState("Signing you in...");

  useEffect(() => {
    const token = searchParams.get("token");

    const run = async () => {
      if (!token) {
        navigate("/signin", { replace: true });
        return;
      }

      // Save token for httpClient
      localStorage.setItem("accessToken", token);
      localStorage.removeItem("companyName");

      setText("Setting up your company account...");

      // Wait until backend is ready for NEW accounts
      // We consider "ready" when company/me is OK and the other endpoints are not 401 anymore
      for (let i = 0; i < 20; i++) {
        const meStatus = await probe("http://localhost:8080/api/company/me", token);
        const subStatus = await probe("http://localhost:8080/api/subscriptions/me", token);
        const jobsStatus = await probe("http://localhost:8080/api/company/jobposts", token);

        // ✅ Ready condition:
        // - company/me must be OK (200)
        // - subscription/jobposts must not be 401 anymore
        if (meStatus === 200 && subStatus !== 401 && jobsStatus !== 401) {
          // fetch me once to store name
          try {
            const meRes = await fetch("http://localhost:8080/api/company/me", {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (meRes.ok) {
              const me = await meRes.json();
              const companyName =
                me?.companyName || me?.company?.name || me?.company?.companyName || "Company";
              localStorage.setItem("companyName", companyName);
            }
          } catch {}

          window.history.replaceState({}, document.title, "/company/dashboard");
          navigate("/company/dashboard", { replace: true });
          return;
        }

        if (i >= 6) setText("Almost done...");
        await sleep(500);
      }

      // If still not ready, don't enter dashboard and crash
      localStorage.removeItem("accessToken");
      localStorage.removeItem("companyName");
      navigate("/signin", { replace: true });
    };

    run();
  }, [navigate, searchParams]);

  return (
    <div style={{ padding: 24 }}>
      <h3 style={{ marginBottom: 8 }}>{text}</h3>
      <p style={{ opacity: 0.75 }}>Please wait…</p>
    </div>
  );
}
