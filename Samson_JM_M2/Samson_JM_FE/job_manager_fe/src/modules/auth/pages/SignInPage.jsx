import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLogo from "../components/AuthLogo";
import AuthLayout from "../components/AuthLayout";
import { AuthContext } from "../context/AuthContext";
import { LoginRequest } from "../models/LoginRequest";
import { authService } from "../service/authService";

const MAX_ATTEMPTS = 5;
const LOCK_SECONDS = 60;

function formatMMSS(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds || 0));
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

export default function SignInPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState(new LoginRequest("", ""));

  const [message, setMessage] = useState("");
  const [attempts, setAttempts] = useState(0);

  const [locked, setLocked] = useState(false);
  const [lockLeft, setLockLeft] = useState(0);

  useEffect(() => {
    if (!locked) return;

    const t = setInterval(() => {
      setLockLeft((prev) => {
        const next = prev > 0 ? prev - 1 : 0;
        if (next === 0) {
          setLocked(false);
          setAttempts(0);
          setMessage("");
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(t);
  }, [locked]);

  const startLock = (seconds) => {
    setLocked(true);
    setLockLeft(seconds);
  };

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      setMessage("Please fill in both fields.");
      return;
    }

    if (locked) {
      setMessage(`Account locked. Try again in ${formatMMSS(lockLeft)}.`);
      return;
    }

    try {
      setMessage("");
      await login(form);

      setAttempts(0);
      setLocked(false);
      setLockLeft(0);

      navigate("/company/dashboard");
    } catch (err) {
      const status = err?.response?.status;

      if (status === 429) {
        startLock(LOCK_SECONDS);
        setMessage(`Too many failed attempts. Account locked for ${LOCK_SECONDS} seconds.`);
        setAttempts(MAX_ATTEMPTS);
        return;
      }

      const nextAttempts = Math.min(MAX_ATTEMPTS, attempts + 1);
      setAttempts(nextAttempts);

      if (nextAttempts >= MAX_ATTEMPTS) {
        startLock(LOCK_SECONDS);
        setMessage(`Too many failed attempts. Account locked for ${LOCK_SECONDS} seconds.`);
        return;
      }

      setMessage(`Invalid email or password. Attempt ${nextAttempts} of ${MAX_ATTEMPTS}.`);
    }
  };

  return (
    <AuthLayout>
      <AuthLogo />

      <div
        className="p-4 shadow-sm bg-white rounded-4"
        style={{ width: "420px", border: "1px solid #eee" }}
      >
        <h4 className="fw-bold">Welcome Back</h4>
        <p className="text-muted mb-4">Sign in to Continue</p>

        <div className="mb-3">
          <label className="form-label fw-semibold">Email</label>
          <div className="input-group">
            <span className="input-group-text bg-white">
              <i className="bi bi-envelope" />
            </span>
            <input
              type="email"
              className="form-control"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Enter your email"
              disabled={locked}
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Password</label>

          <div className="input-group">
            <span className="input-group-text bg-white">
              <i className="bi bi-lock" />
            </span>

            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Enter your password"
              disabled={locked}
            />

            <span
              className="input-group-text bg-white"
              role="button"
              onClick={() => setShowPassword((p) => !p)}
              style={{ cursor: "pointer", color: "#6b7280" }}
              aria-label={showPassword ? "Hide password" : "Show password"}
              title={showPassword ? "Hide password" : "Show password"}
            >
              <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`} />
            </span>
          </div>
        </div>

        {message && (
          <p className={locked ? "text-warning small mb-2" : "text-danger small mb-2"}>
            {message}
          </p>
        )}

        {!locked && attempts > 0 && attempts < MAX_ATTEMPTS && (
          <div className="small text-muted mb-2">
            Attempts: <b>{attempts}</b> / <b>{MAX_ATTEMPTS}</b>
          </div>
        )}

        {locked && (
          <div className="small text-muted mb-3">
            Time remaining: <b>{formatMMSS(lockLeft)}</b>
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <input type="checkbox" className="me-2" disabled={locked} />
            <small>Remember Me</small>
          </div>
          <small className="text-primary" style={{ cursor: "pointer" }}>
            Forgot Password?
          </small>
        </div>

        <button
          className="btn btn-primary w-100 mb-3"
          onClick={handleSubmit}
          disabled={locked}
        >
          {locked ? `Try again in ${formatMMSS(lockLeft)}` : "Sign In"}
        </button>

        <div className="text-center text-muted mb-3">Or</div>

        <button
          className="btn btn-light border w-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: "#D5FFD5" }}
          onClick={() => authService.loginWithGoogle()}
          disabled={locked}
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
