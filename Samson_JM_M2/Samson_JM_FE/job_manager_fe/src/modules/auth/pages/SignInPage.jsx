import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLogo from "../components/AuthLogo";
import AuthInput from "../components/AuthInput";
import AuthLayout from "../components/AuthLayout";
import { AuthContext } from "../context/AuthContext";
import { LoginRequest } from "../models/LoginRequest";
import { authService } from "../service/authService";

export default function SignInPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState(new LoginRequest("", ""));
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      setError("Please fill in both fields.");
      return;
    }

    try {
      await login(form); // ✅ ONLY call context
      navigate("/company/dashboard"); // ✅ redirect
    } catch (err) {
      setError("Invalid email or password.");
    }
  };

  return (
    <AuthLayout>
      <AuthLogo />

      {/* CARD */}
      <div
        className="p-4 shadow-sm bg-white rounded-4"
        style={{ width: "420px", border: "1px solid #eee" }}
      >
        <h4 className="fw-bold">Welcome Back</h4>
        <p className="text-muted mb-4">Sign in to Continue</p>

        <AuthInput
          label="Email"
          type="email"
          icon="bi-envelope"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <AuthInput
          label="Password"
          type="password"
          icon="bi-lock"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {error && <p className="text-danger small">{error}</p>}

        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <input type="checkbox" className="me-2" />
            <small>Remember Me</small>
          </div>
          <small className="text-primary" style={{ cursor: "pointer" }}>
            Forgot Password?
          </small>
        </div>

        <button className="btn btn-primary w-100 mb-3" onClick={handleSubmit}>
          Sign In
        </button>

        <div className="text-center text-muted mb-3">Or</div>

        <button className="btn btn-light border w-100 d-flex justify-content-center align-items-center"
        style={{ backgroundColor: "#D5FFD5" }}
        onClick={() => authService.loginWithGoogle()}
        >
          <i className="bi bi-google me-2"></i>
          Continue with Google
        </button>

        <p className="text-center mt-3">
          Don’t have an account?{" "}
          <span
            className="text-primary"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </AuthLayout>
  );
}
