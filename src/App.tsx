import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {SettingsProvider} from "./providers/settings-provider.tsx";
import {ThemeProvider} from "./providers/theme-provider.tsx";
import {QueryProvider} from "./providers/query-provider.tsx";
import {HelmetProvider} from "react-helmet-async";
import {TooltipsProvider} from "./providers/tooltips-provider.tsx";
import {LoadingBarContainer} from "react-top-loading-bar";
import {BrowserRouter} from "react-router";
import {Toaster} from "sonner";
import {AppRouting} from "./routing/app-routing.tsx";

function App() {
    const queryClient = new QueryClient();
    const { BASE_URL } = import.meta.env;

    return (
        <QueryClientProvider client={queryClient}>
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
        </QueryClientProvider>
    )
}

export default App
