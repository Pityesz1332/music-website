import { BrowserRouter as Router } from "react-router-dom";
import { EndpointRouter } from "./routes/Endpoint_Router";
import { ErrorBoundary } from "react-error-boundary";

import { MusicProvider } from "./context/MusicContext";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { LoadingProvider } from "./context/LoadingContext";
import { AdminProvider } from "./context/AdminContext";
import { ErrorFallback } from "./components/Error_Boundary/ErrorBoundary";

import Notifications from "./components/Notifications/Notifications";
import LoadingOverlay from "./components/Loading_Overlay/LoadingOverlay";

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