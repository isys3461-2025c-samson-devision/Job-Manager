import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import AuthLogo from "../components/AuthLogo";

export default function SignUpPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneCode: "+084",
    phoneNumber: "",
    email: "",
    password: "",
    agree: false,
  });
  const [error, setError] = useState("");

  const handleChange = (field) => (e) => {
    const value =
      field === "agree" ? e.target.checked : e.target.value;
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    if (!form.email || !form.password || !form.firstName || !form.lastName) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!form.agree) {
      setError("You must agree to the Terms and Privacy Policy.");
      return;
    }

    try {
      setError("");
      // call register API here
      console.log("Submit sign up", form);
      // navigate("/signin");
    } catch (e) {
      setError("Sign up failed. Please try again.");
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
          Sign Up To Become a Member!
        </h5>

        <button
          className="btn w-100 mb-3 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: "#D5FFD5" }}
        >
          <i className="bi bi-google me-2" />
          Continue with Google
        </button>

        <div className="row">
          <div className="col-6 mb-3">
            <label className="form-label small">Last Name</label>
            <input
              className="form-control"
              value={form.lastName}
              onChange={handleChange("lastName")}
            />
          </div>
          <div className="col-6 mb-3">
            <label className="form-label small">First Name</label>
            <input
              className="form-control"
              value={form.firstName}
              onChange={handleChange("firstName")}
            />
          </div>
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
          <label className="form-label small">Email</label>
          <input
            className="form-control"
            type="email"
            placeholder="Use a valid email to verify"
            value={form.email}
            onChange={handleChange("email")}
          />
        </div>

        <div className="mb-3">
          <label className="form-label small">Password</label>
          <input
            className="form-control"
            type="password"
            placeholder="From 6 to 50 characters, 1 uppercase letter and 1 number"
            value={form.password}
            onChange={handleChange("password")}
          />
        </div>

        <div className="form-check mb-2">
          <input
            className="form-check-input"
            type="checkbox"
            id="agree"
            checked={form.agree}
            onChange={handleChange("agree")}
          />
          <label htmlFor="agree" className="form-check-label small">
            I agree to the Terms of Service and Privacy Policy of DEVision.
          </label>
        </div>

        {error && <p className="text-danger small mb-2">{error}</p>}

        <button
          className="btn w-100 mb-3"
          style={{ backgroundColor: "#FF9A3C", color: "#fff" }}
          onClick={handleSubmit}
        >
          Sign Up
        </button>

        <p className="text-center small mb-0">
          Already a DEVision member?{" "}
          <span
            className="text-primary"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/signin")}
          >
            Sign In
          </span>
        </p>
      </div>
    </AuthLayout>
  );
}
