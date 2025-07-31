import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import MainLayout from "./root/MainLayout.jsx/MainLayout";
import { router } from "./routes/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "./contexts/AuthProvider";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client = {queryClient}> 
      <AuthProvider>
        <RouterProvider router={router}>
        <MainLayout />
      </RouterProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
