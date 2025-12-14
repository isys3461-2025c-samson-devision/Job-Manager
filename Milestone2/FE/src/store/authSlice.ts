import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, ProfileFormData, Skill, User } from "../types";

const initialState: AuthState = {
  user: null,
  token: null, // keep access token in memory only
  loading: false,
  error: null,
  profile: {
    profileData: null,
    skills: [],
    loading: false,
    error: null,
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string | null | undefined>) => {
      const next = action.payload ?? '';
      if (typeof next === 'string' && next.length > 0) {
        state.token = next;
      }
      // ignore empty/undefined payload to avoid accidentally wiping token
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
    },
    clearError: (state) => {
      state.error = null;
    },

    // Profile-related actions
    setProfileData: (state, action: PayloadAction<ProfileFormData>) => {
      state.profile.profileData = action.payload;
    },
    setProfileLoading: (state, action: PayloadAction<boolean>) => {
      state.profile.loading = action.payload;
    },
    setProfileError: (state, action: PayloadAction<string | null>) => {
      state.profile.error = action.payload;
    },
    setSkills: (state, action: PayloadAction<Skill[]>) => {
      state.profile.skills = action.payload;
    },
    clearProfile: (state) => {
      state.profile.profileData = null;
      state.profile.error = null;
    },
  },
});

export const {
  setToken,
  setUser,
  setLoading,
  setError,
  logout,
  clearError,
  setProfileData,
  setProfileLoading,
  setProfileError,
  setSkills,
  clearProfile,
} = authSlice.actions;

export default authSlice.reducer;