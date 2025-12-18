import { Link } from 'react-router-dom';
import shibaImg from '../../assets/shiba_find_job.png';
import { useLogin } from '../../hooks/useLogin';

export default function Login() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleSubmit,
  } = useLogin('/dashboard');

  return (
    <div className="flex min-h-screen">
      {/* LEFT */}
      <div className="w-[35vw] min-w-[420px] flex items-center justify-center bg-slate-50">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-blue-600 text-center">
            Welcome To JA SAMSON
          </h2>
          <p className="text-center text-slate-500 mt-1">
            Please login to your account
          </p>

          {error && (
            <div className="mt-4 rounded bg-red-100 text-red-700 px-3 py-2 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-800
                text-white font-semibold py-2 hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              className="text-blue-600 font-semibold hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div
        className="flex-1 bg-cover bg-center"
        style={{ backgroundImage: `url(${shibaImg})` }}
      />
    </div>
  );
}
