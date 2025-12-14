import React, { useState } from "react";
import shibaImg from "../../assets/shiba_find_job.png";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setToken } from "../../store/authSlice";
import { register } from "../../services/authService";

const Register = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		try {
			const data = await register(email, password);
			// Backend returns accessToken in response.data.data and sets refreshToken via httpOnly cookie
			dispatch(setToken(data.data?.accessToken));
			navigate("/dashboard");
		} catch (err) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const apiError = (err as any)?.response?.data;
			console.log('API error response:', apiError);
			if (apiError) {
				// Collect all error messages
				const messages: string[] = [];
				if (typeof apiError === 'string') {
					messages.push(apiError);
				} else {
					if (apiError.error) messages.push(apiError.error);
					if (apiError.message) messages.push(apiError.message);
					if (apiError.errors && typeof apiError.errors === 'object') {
						Object.values(apiError.errors).forEach((val) => {
							if (Array.isArray(val)) {
								messages.push(...val);
							} else if (typeof val === 'string') {
								messages.push(val);
							}
						});
					}
				}
				setError(messages.length > 0 ? messages.join(' | ') : 'Register failed');
			} else {
				setError('Register failed');
			}
		} finally {
			setLoading(false);
		}
	};

	 return (
		 <div style={{
			 minHeight: "100vh",
			 width: "100vw",
			 position: "relative",
			 display: "flex",
			 alignItems: "center",
			 justifyContent: "center",
			 fontFamily: 'Segoe UI, Arial, sans-serif',
			 background: `url(${shibaImg}) center/cover no-repeat #f8fafc`,
		 }}>
			 <div style={{
				 maxWidth: 400,
				 width: "100%",
				 background: "rgba(255,255,255,0.95)",
				 borderRadius: "18px",
				 boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
				 padding: "2.5rem 2rem",
				 margin: "2rem",
				 zIndex: 2,
			 }}>
				 <div style={{ textAlign: "center", marginBottom: "2rem" }}>
					 <h2 style={{ fontWeight: 700, fontSize: "2rem", color: "#2563eb", marginBottom: "0.5rem" }}>Register JA SAMSON</h2>
					 <p style={{ color: "#64748b", fontSize: "1rem" }}>Create your account</p>
				 </div>

				{/* Move up: Already have an account? */}
				<div style={{ textAlign: "center", margin: "0.5rem 0 1.5rem 0" }}>
					<span style={{ color: "#64748b", fontSize: "0.98rem" }}>
						Already have an account?{' '}
						<Link to="/login" style={{ color: "#2563eb", textDecoration: "underline", cursor: "pointer", fontWeight: 600 }}>
							Login Here
						</Link>
					</span>
				</div>

				 {error && (
					 <div style={{ background: "#fee2e2", color: "#b91c1c", borderRadius: "6px", padding: "0.5rem", textAlign: "center", marginBottom: "1rem", fontSize: "0.95rem" }}>{error}</div>
				 )}

				 <form onSubmit={handleSubmit}>
					 <div style={{ marginBottom: "1.2rem" }}>
						 <label htmlFor="email" style={{ fontWeight: 600, marginBottom: "0.5rem", display: "block", color: "#334155" }}>
							 Email address
						 </label>
						 <input
							 type="email"
							 id="email"
							 value={email}
							 onChange={(e) => setEmail(e.target.value)}
							 placeholder="Enter your email"
							 required
							 style={{
								 borderRadius: "8px",
								 border: "1px solid #cbd5e1",
								 padding: "0.75rem 1rem",
								 width: "100%",
								 fontSize: "1rem",
								 outline: "none",
								 boxSizing: "border-box",
								 marginTop: "0.2rem",
							 }}
						 />
					 </div>

					 <div style={{ marginBottom: "1.8rem" }}>
						 <label htmlFor="password" style={{ fontWeight: 600, marginBottom: "0.5rem", display: "block", color: "#334155" }}>
							 Password
						 </label>
						 <input
							 type="password"
							 id="password"
							 value={password}
							 onChange={(e) => setPassword(e.target.value)}
							 placeholder="Enter your password"
							 required
							 style={{
								 borderRadius: "8px",
								 border: "1px solid #cbd5e1",
								 padding: "0.75rem 1rem",
								 width: "100%",
								 fontSize: "1rem",
								 outline: "none",
								 boxSizing: "border-box",
								 marginTop: "0.2rem",
							 }}
						 />
					 </div>

					 <button
						 type="submit"
						 disabled={loading}
						 style={{
							 borderRadius: "8px",
							 background: "linear-gradient(90deg,#2563eb 60%,#1e40af 100%)",
							 color: "#fff",
							 fontWeight: 600,
							 fontSize: "1.15rem",
							 width: "100%",
							 padding: "0.85rem 0",
							 boxShadow: "0 4px 16px rgba(37,99,235,0.08)",
							 border: "none",
							 cursor: loading ? "not-allowed" : "pointer",
							 transition: "background 0.2s",
						 }}
					 >
						 {loading ? "Registering..." : "Register"}
					 </button>
				 </form>
			 </div>
		 </div>
	);
};

export default Register;