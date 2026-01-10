import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { localStorageUtil } from "../../../infrastructure/storage/localStorageUtil";

export default function OAuthSuccessPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const companyName = localStorageUtil.getCompanyName();

    const accessToken = params.get("accessToken");

    if (accessToken) {
      localStorageUtil.setToken(accessToken);
      localStorageUtil.setCompanyName(companyName);
      navigate("/company/dashboard", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, [navigate, params]);

  return <p>Signing you in...</p>;
}
