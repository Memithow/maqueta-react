import { AuthProvider } from '@/auth/providers/auth-provider.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router';
import { LoadingBarContainer } from 'react-top-loading-bar';
import { Toaster } from 'sonner';
import { QueryProvider } from './providers/query-provider.tsx';
import { SettingsProvider } from './providers/settings-provider.tsx';
import { ThemeProvider } from './providers/theme-provider.tsx';
import { TooltipsProvider } from './providers/tooltips-provider.tsx';
import { AppRouting } from './routing/app-routing.tsx';

function App() {
  const queryClient = new QueryClient();
  const { BASE_URL } = import.meta.env;

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SettingsProvider>
          <ThemeProvider>
            <HelmetProvider>
              <TooltipsProvider>
                <QueryProvider>
                  <LoadingBarContainer>
                    <BrowserRouter basename={BASE_URL}>
                      <Toaster />
                      <AppRouting />
                    </BrowserRouter>
                  </LoadingBarContainer>
                </QueryProvider>
              </TooltipsProvider>
            </HelmetProvider>
          </ThemeProvider>
        </SettingsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
