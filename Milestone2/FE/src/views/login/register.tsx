import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setToken } from '../../store/authSlice';
import { register } from '../../services/authService';
import shibaImg from '../../assets/shiba_find_job.png';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await register(email, password);
      dispatch(setToken(data.data?.accessToken));
      navigate('/profile/create');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any ) {
      const apiError = err?.response?.data;

      if (apiError) {
        const messages: string[] = [];

        if (typeof apiError === 'string') {
          messages.push(apiError);
        } else {
          if (apiError.error) messages.push(apiError.error);
          if (apiError.message) messages.push(apiError.message);
          if (apiError.errors && typeof apiError.errors === 'object') {
            Object.values(apiError.errors).forEach((val) => {
              if (Array.isArray(val)) messages.push(...val);
              else if (typeof val === 'string') messages.push(val);
            });
          }
        }

        setError(messages.length ? messages.join(' | ') : 'Register failed');
      } else {
        setError('Register failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${shibaImg})` }}
    >
      <div className="w-full max-w-md bg-white/95 rounded-2xl shadow-xl p-8 mx-4">
        {/* HEADER */}
        <h2 className="text-2xl font-bold text-blue-600 text-center">
          Register JA SAMSON
        </h2>
        <p className="text-center text-slate-500 mt-1">
          Create your account
        </p>

        {/* LOGIN LINK */}
        <p className="text-center text-sm text-slate-500 mt-4">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Login here
          </Link>
        </p>

        {/* ERROR */}
        {error && (
          <div className="mt-4 rounded bg-red-100 text-red-700 px-3 py-2 text-sm text-center">
            {error}
          </div>
        )}

        {/* FORM */}
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
              placeholder="Enter your email"
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
              placeholder="Enter your password"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2
                focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-800
              text-white font-semibold py-2 hover:opacity-90
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}
