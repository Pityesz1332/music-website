import { BrowserRouter as Router } from "react-router-dom";
import { EndpointRouter } from "./routes/EndpointRouter";
import { ErrorBoundary } from "react-error-boundary";

import { MusicProvider } from "./context/MusicContext";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { LoadingProvider } from "./context/LoadingContext";
import { AdminProvider } from "./context/AdminContext";
import { ErrorFallback } from "./components/error-boundary/ErrorBoundary";

import Notifications from "./components/notifications/Notifications";
import LoadingOverlay from "./components/ui/loading-overlay/LoadingOverlay";

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <NotificationProvider>
        <LoadingProvider>
          <AuthProvider>
            <AdminProvider>
              <MusicProvider>
                <Notifications />
                <LoadingOverlay />
                <Router>
                  <EndpointRouter />
                </Router>
              </MusicProvider>
            </AdminProvider>
          </AuthProvider>
        </LoadingProvider>
      </NotificationProvider>
    </ErrorBoundary>
  );
};

export default App;