import { BrowserRouter as Router } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { EndpointRouter } from "@routes/EndpointRouter";

import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { wagmiConfig } from "./config/wagmiConfig";

import { MusicProvider } from "@context/MusicContext";
import { AuthProvider } from "@context/AuthContext";
import { NotificationProvider } from "@context/NotificationContext";
import { LoadingProvider } from "@context/LoadingContext";
import { AdminProvider } from "@context/AdminContext";
import { ErrorFallback } from "@components/error-boundary/ErrorBoundary";

import Notifications from "@components/notifications/Notifications";
import LoadingOverlay from "@components/ui/loading-overlay/LoadingOverlay";

const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
      </WagmiProvider>
    </ErrorBoundary>
  );
};

export default App;