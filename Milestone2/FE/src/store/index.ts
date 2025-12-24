import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlice';
import jobReducer from './jobSlice';

// Persist configuration: persist auth slice but blacklist token (memory-only)
const authPersistConfig = {
  key: 'auth',
  storage,
  blacklist: ['token'],
};

const persistedAuth = persistReducer(authPersistConfig, authReducer);

const persistedReducer = combineReducers({
  auth: persistedAuth,
  job: jobReducer,
});

export const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;