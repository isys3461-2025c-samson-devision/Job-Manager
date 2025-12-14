
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { setToken } from "../../store/authSlice";
import { login } from "../../services/authService";
import shibaImg from "../../assets/shiba_find_job.png";

const Login = () => {
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
			const data = await login(email, password);
			// Backend returns accessToken in response.data.data and refreshToken via httpOnly cookie
			// Only store accessToken in Redux
			dispatch(setToken(data.data?.accessToken));
			navigate("/dashboard");
		} catch (err) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const apiError = (err as any)?.response?.data;
			console.log('API error response:', apiError);
			if (apiError) {
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
				setError(messages.length > 0 ? messages.join(' | ') : 'Login failed');
			} else {
				setError('Login failed');
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div style={{ display: "flex", overflow: "hidden", minHeight: "100vh", fontFamily: 'Segoe UI, Arial, sans-serif' }}>
			{/* Left Side - Login Form */}
			<div
				style={{
					width: "35vw",
					height: "100vh",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					background: "#f8fafc",
				}}
			>
				<div style={{
					maxWidth: 400,
					width: "100%",
					background: "#fff",
					borderRadius: "18px",
					boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
					padding: "2.5rem 2rem",
					margin: "2rem",
				}}>
					<div style={{ textAlign: "center", marginBottom: "2rem" }}>
						<h2 style={{ fontWeight: 700, fontSize: "2rem", color: "#2563eb", marginBottom: "0.5rem" }}>Welcome To JA SAMSON</h2>
						<p style={{ color: "#64748b", fontSize: "1rem" }}>Please login to your account</p>
								</div>
								<div style={{ textAlign: "center", marginTop: "1.5rem" }}>
                                    <span style={{ color: "#64748b", fontSize: "0.98rem" }}>
                                        Don't have an account?{' '}
                                        <Link to="/register" style={{ color: "#2563eb", textDecoration: "underline", cursor: "pointer", fontWeight: 600 }}>
                                            Create Account
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
							{loading ? "Logging in..." : "Login"}
						</button>
					</form>
				</div>
			</div>

            <div
                style={{
                    width: "65vw",
                    height: "100vh",
                    backgroundImage: `url('${shibaImg}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    filter: "brightness(0.93) contrast(1.08)",
                }}
            ></div>
		</div>
	);
};

export default Login;