import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import AuthLogo from "../components/AuthLogo";
import { authService } from "../service/authService";
import OAuthCompleteRequest from "../models/OAuthCompleteRequest";
import { localStorageUtil } from "../../../infrastructure/storage/localStorageUtil";
import { allCountries } from "country-telephone-data";

export default function CompleteProfilePage() {
  const [searchParams] = useSearchParams();
  const emailFromOAuth = searchParams.get("email");

  const [form, setForm] = useState({
    companyName: "",
    phoneCode: "+84",
    phoneNumber: "",
    country: "Vietnam",
  });

  const countryOptions = allCountries.map((c) => ({
    name: c.name,
    dialCode: `+${c.dialCode}`,
    iso2: c.iso2,
    flag: c.flag,
  }));

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!emailFromOAuth) {
      setError("Missing OAuth email. Please login again.");
    }
  }, [emailFromOAuth]);

  const handleChange = (field) => (e) => {
    const value = e.target.value;

    if (field === "country") {
      const selected = countryOptions.find((c) => c.name === value);

      setForm((prev) => ({
        ...prev,
        country: value,
        phoneCode: selected ? selected.dialCode : prev.phoneCode,
      }));
      return;
    }

    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.companyName || !form.phoneNumber || !form.country) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setError("");
      setLoading(true);

      const payload = new OAuthCompleteRequest({
        email: emailFromOAuth,
        companyName: form.companyName,
        country: form.country,
        phoneNumber: `${form.phoneCode}${form.phoneNumber}`,
      });

      const res = await authService.completeOAuthProfile(payload);

      // ✅ CORRECT: use shared storage util
      localStorageUtil.setToken(res.accessToken);
      localStorageUtil.setRole(res.role);
      localStorageUtil.setCompanyName(res.companyName);

      // ✅ IMPORTANT: force app re-hydration
      window.location.href = "/company/dashboard";
    } catch (e) {
      console.error(e);
      setError("Failed to complete profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthLogo />

      <div
        className="bg-white rounded-4 shadow-sm p-4"
        style={{ width: "480px", border: "1px solid #eee" }}
      >
        <h5 className="fw-bold text-center mb-3">
          Complete Your Company Profile
        </h5>

        {/* Email (locked) */}
        <div className="mb-3">
          <label className="form-label small">Email</label>
          <input
            className="form-control"
            value={emailFromOAuth || ""}
            disabled
          />
        </div>

        <div className="mb-3">
          <label className="form-label small">Company Name</label>
          <input
            className="form-control"
            value={form.companyName}
            onChange={handleChange("companyName")}
          />
        </div>

        <div className="mb-3">
          <label className="form-label small">Phone Number</label>
          <div className="row">
            <div className="col-4">
              <select
                className="form-select"
                value={form.phoneCode}
                onChange={handleChange("phoneCode")}
              >
                {countryOptions.map((c) => (
                  <option key={c.iso2} value={c.dialCode}>
                    {c.flag} {c.dialCode}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-8">
              <input
                className="form-control"
                type="tel"
                value={form.phoneNumber}
                onChange={handleChange("phoneNumber")}
              />
            </div>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label small">Country</label>
          <select
            className="form-select"
            value={form.country}
            onChange={handleChange("country")}
          >
            <option value="">Select your country</option>
            {countryOptions.map((c) => (
              <option key={c.iso2} value={c.name}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="text-danger small mb-2">{error}</p>}

        <button
          className="btn w-100 mb-3"
          style={{ backgroundColor: "#FF9A3C", color: "#fff" }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Saving..." : "Complete Profile"}
        </button>
      </div>
    </AuthLayout>
  );
}
