import AppRouter from "../infrastructure/router/AppRouter";
import {AuthProvider} from "../modules/auth/context/AuthProvider";
import { SubscriptionProvider } from "../modules/subscription/context/SubscriptionContext";

function App() {
  return (
    <SubscriptionProvider>
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
    </SubscriptionProvider>
  );
}

export default App;
