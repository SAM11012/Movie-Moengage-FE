import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Provider } from "react-redux";
import store, { persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import Index from "./pages/Index";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import Analytics from "./pages/Analytics";
import Placeholder from "./pages/Placeholder";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ThemeProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/login" element={<Index />} />
                  <Route path="/movie/:id" element={<MovieDetails />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route
                    path="/terms"
                    element={
                      <Placeholder
                        title="Terms of Service"
                        description="Read our terms of service and user agreement."
                        backLink="/signup"
                      />
                    }
                  />
                  <Route
                    path="/privacy"
                    element={
                      <Placeholder
                        title="Privacy Policy"
                        description="Learn about how we protect and handle your data."
                        backLink="/signup"
                      />
                    }
                  />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </BrowserRouter>
          </ThemeProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </PersistGate>
  </Provider>
);

createRoot(document.getElementById("root")!).render(<App />);
