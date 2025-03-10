import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuthStore } from "./store/authStore";
import Home from "./pages/home";
import AllProduct from "./pages/allProducts";
import CreateProductForm from "./pages/create-new";
import UpdateProduct from "./pages/updateProduct";
import Login from "./pages/Login";
import TwoFAVerification from "./components/TwoFAVerification";
import { ProtectedRoute } from "./components/ProtectedRoute";
import AllCustomers from "./pages/AllCustomers";
import AdminProfile from "./pages/AdminProfile";
import AdminChatPage from "./pages/AdminChatPage";
import { Toaster } from "sonner";
import DashboardLayout from "./components/DashboardLayout";

const queryClient = new QueryClient();

// Route guard for 2FA
function Verify2FARoute() {
  const { requires2FA, tempToken } = useAuthStore();

  if (!requires2FA && !tempToken) {
    return <Navigate to="/login" replace />;
  }

  return <TwoFAVerification />;
}

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/verify-2fa" element={<Verify2FARoute />} />

          {/* Protected routes with Dashboard Layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/all-products" element={<AllProduct />} />
              <Route path="/messages" element={<AdminChatPage />} />
              <Route path="/admin/profile" element={<AdminProfile />} />
              <Route path="/all-products" element={<AllProduct />} />
              <Route path="/new-product" element={<CreateProductForm />} />
              <Route path="/update-product/:id" element={<UpdateProduct />} />
              <Route path="/customers" element={<AllCustomers />} />
            </Route>
          </Route>

          {/* Admin-only routes with Dashboard Layout */}
          {/* <Route element={<AdminRoute />}>
            <Route element={<DashboardLayout />}>
              
            </Route>
          </Route> */}

          {/* Fallback redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
