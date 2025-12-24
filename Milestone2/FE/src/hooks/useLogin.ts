import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { setToken } from '../store/authSlice';
import { login } from '../services/authService';

type ApiErrorLike = {
  response?: {
    data?: unknown;
  };
};

export function useLogin(redirectTo: string = '/dashboard') {
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
      const data = await login(email, password);
      const accessToken = data?.data?.accessToken;
      dispatch(setToken(accessToken));
      navigate(redirectTo);
    } catch (err: unknown) {
      const apiError = (err as ApiErrorLike)?.response?.data;

      if (apiError && typeof apiError === 'object' && 'message' in apiError) {
        const msg = (apiError as { message?: unknown }).message;
        if (typeof msg === 'string' && msg.trim()) {
          setError(msg);
          return;
        }
      }

      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleSubmit,
  };
}
