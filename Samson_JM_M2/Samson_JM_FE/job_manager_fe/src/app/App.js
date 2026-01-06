import AppRouter from "../infrastructure/router/AppRouter";
import { AuthProvider } from "../modules/auth/context/AuthProvider";
import { SubscriptionProvider } from "../modules/subscription/context/SubscriptionContext";

function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <AppRouter />
      </SubscriptionProvider>
    </AuthProvider>
  );
}

export default App;
