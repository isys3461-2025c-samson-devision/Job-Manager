import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import AuthLogo from "../components/AuthLogo";
import { authService } from "../service/authService";
import OAuthCompleteRequest from "../models/OAuthCompleteRequest";

export default function CompleteProfilePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const emailFromOAuth = searchParams.get("email");

  const [form, setForm] = useState({
    companyName: "",
    phoneCode: "+084",
    phoneNumber: "",
    country: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!emailFromOAuth) {
      setError("Missing OAuth email. Please login again.");
    }
  }, [emailFromOAuth]);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
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

      // ✅ Save JWT
      localStorage.setItem("authToken", res.accessToken);

      // ✅ Redirect after OAuth completion
      navigate("/company/dashboard");
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
                <option value="+084">🇻🇳 +084</option>
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
            <option value="Vietnam">Vietnam</option>
            <option value="Singapore">Singapore</option>
            <option value="Australia">Australia</option>
            <option value="United States">United States</option>
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
