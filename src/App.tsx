import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CivicAuthProvider, CivicAuthGate } from "@/lib/civicAuth";
import AppLayout from "@/components/layout/AppLayout";
import DashboardPage from "@/pages/DashboardPage";
import GoalsPage from "@/pages/GoalsPage";
import SpendingPage from "@/pages/SpendingPage";
import PortfolioPage from "@/pages/PortfolioPage";
import TaxPage from "@/pages/TaxPage";
import AIAdvisorPage from "@/pages/AIAdvisorPage";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5, retry: 1 } },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CivicAuthProvider>
        <BrowserRouter>
          <Routes>
            <Route
              element={
                <CivicAuthGate>
                  <AppLayout />
                </CivicAuthGate>
              }
            >
              <Route path="/" element={<DashboardPage />} />
              <Route path="/goals" element={<GoalsPage />} />
              <Route path="/spending" element={<SpendingPage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/tax" element={<TaxPage />} />
              <Route path="/advisor" element={<AIAdvisorPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CivicAuthProvider>
    </QueryClientProvider>
  );
}
