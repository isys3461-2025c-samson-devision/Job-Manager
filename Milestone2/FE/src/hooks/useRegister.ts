import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { setToken } from '../store/authSlice';
import { register } from '../services/authService';
import { useCountries } from './useCountries';

const REGISTER_COUNTRY_STORAGE_KEY = 'registerCountry';

type ApiErrorObject = {
  error?: string;
  message?: string;
  errors?: Record<string, string[] | string>;
};

type ApiErrorLike = {
  response?: {
    data?: unknown;
  };
};

export function useRegister(redirectTo: string = '/profile/create') {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* -------- Auth fields -------- */
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  /* -------- Country -------- */
  const { countries } = useCountries();
  const [country, setCountry] = useState(() =>
    localStorage.getItem(REGISTER_COUNTRY_STORAGE_KEY) ?? ''
  );

  /* -------- UI states -------- */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countryError, setCountryError] = useState('');

  const handleCountryChange = (value: string) => {
    setCountry(value);
    localStorage.setItem(REGISTER_COUNTRY_STORAGE_KEY, value);
    if (countryError) setCountryError('');
  };

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
      // NOTE: register API receives email + password
      const data = await register(email, password);

      const accessToken = data?.data?.accessToken;
      dispatch(setToken(accessToken));

      // Persist selected country for profile-create
      localStorage.setItem(REGISTER_COUNTRY_STORAGE_KEY, country);

      navigate(redirectTo);
    } catch (err: unknown) {
      const apiError = (err as ApiErrorLike)?.response?.data;

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

  return {
    email,
    setEmail,
    password,
    setPassword,
    countries,
    country,
    handleCountryChange,
    loading,
    error,
    countryError,
    handleSubmit,
  };
}
