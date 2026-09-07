import { HashRouter as Router } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { EndpointRouter } from "@routes/EndpointRouter";

import { MusicProvider } from "@context/MusicContext";
import { NotificationProvider } from "@context/NotificationContext";
import { LoadingProvider } from "@context/LoadingContext";
import { AdminProvider } from "@context/AdminContext";
import { ErrorFallback } from "@components/error-boundary/ErrorBoundary";

import Notifications from "@components/notifications/Notifications";
import LoadingOverlay from "@components/ui/loading-overlay/LoadingOverlay";

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <NotificationProvider>
        <LoadingProvider>
          <AdminProvider>
            <MusicProvider>
              <Notifications />
              <LoadingOverlay />
              <Router>
                <EndpointRouter />
              </Router>
            </MusicProvider>
          </AdminProvider>
        </LoadingProvider>
      </NotificationProvider>
    </ErrorBoundary>
  );
};

export default App;