import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import AuthLogo from "../components/AuthLogo";

export default function SignUpPage() {
  const navigate = useNavigate();
  const passwordInputRef = useRef(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneCode: "+084",
    phoneNumber: "",
    email: "",
    password: "",
    country: "",
    agree: false,
  });
  const [error, setError] = useState("");
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field) => (e) => {
    const value = field === "agree" ? e.target.checked : e.target.value;
    setForm({ ...form, [field]: value });
  };

  const isValidPassword = (pwd) => {
    const regex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,50}$/;
    return regex.test(pwd);
  };

  const handleSubmit = async () => {
    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.password ||
      !form.country
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!isValidPassword(form.password)) {
      setError(
        "Password must be 8–50 characters, with at least 1 uppercase letter, 1 number, and 1 special character."
      );
      return;
    }

    if (!form.agree) {
      setError("You must agree to the Terms and Privacy Policy.");
      return;
    }

    try {
      setError("");
      console.log("Submit sign up", form);
      // navigate("/signin");
    } catch (e) {
      setError("Sign up failed. Please try again.");
    }
  };

  const passwordChecks = {
    hasMinLength: form.password.length >= 8 && form.password.length <= 50,
    hasUppercase: /[A-Z]/.test(form.password),
    hasNumber: /\d/.test(form.password),
    hasSpecial: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(form.password),
  };

  const renderCheckItem = (ok, text) => (
    <div className={ok ? "text-success small" : "text-muted small"}>
      {ok ? "✔" : "•"} {text}
    </div>
  );

  const toggleShowPassword = (e) => {
    // prevent losing focus from input when clicking icon
    e.preventDefault();
    setShowPassword((prev) => !prev);
    if (passwordInputRef.current) {
      passwordInputRef.current.focus();
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

        <div className="mb-3 position-relative">
          <label className="form-label small">Password</label>

          <div className="position-relative">
            <input
              ref={passwordInputRef}
              className="form-control"
              type={showPassword ? "text" : "password"}
              placeholder="" // no text inside box
              value={form.password}
              onChange={handleChange("password")}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              style={{ paddingRight: "2.5rem" }} // space for eye icon
            />

            <i
              className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}
              onMouseDown={toggleShowPassword}
              style={{
                position: "absolute",
                right: "0.75rem",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                fontSize: "1.1rem",
                color: "#6c757d",
              }}
            />
          </div>

          {(passwordFocused || form.password.length > 0) && (
            <div
              className="mt-1 p-2 rounded-3 shadow-sm bg-light"
              style={{
                fontSize: "0.75rem",
                border: "1px solid #ddd",
              }}
            >
              {renderCheckItem(passwordChecks.hasMinLength, "8–50 characters")}
              {renderCheckItem(
                passwordChecks.hasUppercase,
                "At least 1 uppercase letter"
              )}
              {renderCheckItem(passwordChecks.hasNumber, "At least 1 number")}
              {renderCheckItem(
                passwordChecks.hasSpecial,
                "At least 1 special character"
              )}
            </div>
          )}
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
