import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { localStorageUtil } from "../../../infrastructure/storage/localStorageUtil";

export default function OAuthSuccessPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");

    if (token) {
      localStorageUtil.setToken(token);
      navigate("/company/dashboard", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, [navigate, params]);

  return <p>Signing you in...</p>;
}
