import { useEffect } from "react";
import AppRouter from "./routes";
import { useAppDispatch } from "./store/hooks";
import { refreshToken } from "./services/authService";
import { setToken } from "./store/authSlice";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const hydrate = async () => {
      try {
        const resp = await refreshToken();
        const accessToken = resp?.data?.accessToken;
        if (typeof accessToken === "string" && accessToken.length > 0) {
          dispatch(setToken(accessToken));
        }
      } catch {
        // Not logged in or refresh cookie missing/expired
      }
    };

    hydrate();
  }, [dispatch]);

  return <AppRouter />;
}

export default App;
