import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { setToken } from '../../store/authSlice';
import { register } from '../../services/authService';
import shibaImg from '../../assets/shiba_find_job.png';
import CountrySelect from '../../components/CountrySelect';

/* ================= TYPES ================= */

interface Country {
  code: string;
  name: string;
}

type RestCountry = {
  cca2?: string;
  name?: {
    common?: string;
  };
};

type RestCountryWithFields = {
  cca2: string;
  name: {
    common: string;
  };
};

type ApiErrorObject = {
  error?: string;
  message?: string;
  errors?: Record<string, string[] | string>;
};

/* ================= COMPONENT ================= */

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* -------- Auth fields -------- */
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  /* -------- Country -------- */
  const [countries, setCountries] = useState<Country[]>([]);
  const [country, setCountry] = useState('');

  /* -------- UI states -------- */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countryError, setCountryError] = useState('');

  /* ================= FETCH COUNTRIES ================= */

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await axios.get(
          'https://restcountries.com/v3.1/all?fields=name,cca2'
        );

        const raw = res.data as RestCountry[];
        const data: Country[] = raw
          .filter(
            (c): c is RestCountryWithFields =>
              typeof c.cca2 === 'string' &&
              typeof c.name?.common === 'string' &&
              c.cca2.length > 0 &&
              c.name.common.length > 0
          )
          .map((c) => ({
            name: c.name.common,
            code: c.cca2,
          }))
          .sort((a: Country, b: Country) =>
            a.name.localeCompare(b.name)
          );

        setCountries(data);
      } catch {
        console.error('Failed to load countries');
      }
    };

    fetchCountries();
  }, []);

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCountryError('');

    if (!country) {
      setCountryError('Country is required');
      return;
    }

    setLoading(true);

    try {
      // NOTE: register API vẫn chỉ nhận email + password
      const data = await register(email, password);

      const accessToken = data?.data?.accessToken;
      dispatch(setToken(accessToken));

      // Country có thể lưu tạm nếu muốn
      localStorage.setItem('registerCountry', country);

      navigate('/profile/create');
    } catch (err: unknown) {
      const apiError = (err as { response?: { data?: unknown } })?.response?.data;

      if (apiError) {
        const messages: string[] = [];

        if (typeof apiError === 'string') {
          messages.push(apiError);
        } else if (typeof apiError === 'object' && apiError !== null) {
          const obj = apiError as ApiErrorObject;
          if (typeof obj.error === 'string') messages.push(obj.error);
          if (typeof obj.message === 'string') messages.push(obj.message);
          if (obj.errors && typeof obj.errors === 'object') {
            Object.values(obj.errors).forEach((val) => {
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

  /* ================= RENDER ================= */

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

          {/* COUNTRY */}
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Country
            </label>

            <CountrySelect
              countries={countries}
              value={country}
              onChange={setCountry}
              error={!!countryError}
            />

            {countryError && (
              <p className="text-sm text-red-600 mt-1">
                {countryError}
              </p>
            )}
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
