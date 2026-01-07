import AppRouter from "../infrastructure/router/AppRouter";
import {AuthProvider} from "../modules/auth/context/AuthProvider";

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
