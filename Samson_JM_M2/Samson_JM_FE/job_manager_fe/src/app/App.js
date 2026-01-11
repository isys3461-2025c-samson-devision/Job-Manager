import AppRouter from "../infrastructure/router/AppRouter";
import { AuthProvider } from "../modules/auth/context/AuthProvider";
import { SubscriptionProvider } from "../modules/subscription/context/SubscriptionContext";
import { NotificationProvider } from "../modules/notification/context/NotificationContext";

function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <NotificationProvider>
          <AppRouter />
        </NotificationProvider>
      </SubscriptionProvider>
    </AuthProvider>
  );
}

export default App;
