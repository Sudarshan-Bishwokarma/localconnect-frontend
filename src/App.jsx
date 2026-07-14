import { useState } from "react";
import VendorHeader from "./components/Vendor/VendorHeader";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./components/Vendor/VendorLayout";
import AdminDashboard from "./pages/vendor/VendorDashboard";
import SignUp from "./pages/auth/SignUp";
import { Toaster } from "react-hot-toast";
import Login from "./pages/auth/Login";
import OtpVerify from "./pages/auth/OtpVerify";
import Home from "./pages/Home";
import ProtectedRoute from "./components/common/ProtectedRoute";
import ProductPage from "./pages/vendor/ProductPage";
import AddProductForm from "./components/Vendor/VendorProductForm";
import ViewProduct from "./pages/vendor/VendorViewProduct";
import AdminViewProduct from "./pages/vendor/VendorViewProduct";
import OAuthSuccess from "./pages/auth/OAuthSuccess";
import AuthLayout from "./pages/auth/AuthLayout";
import VendorViewProduct from "./pages/vendor/VendorViewProduct";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import VendorProductForm from "./components/Vendor/VendorProductForm";
import VendorLayout from "./components/Vendor/VendorLayout";
import VendorOnBoarding from "./pages/vendor/VendorOnboarding";
import CompleteProfile from "./pages/auth/CompleteProfile";
import ChooseRole from "./pages/auth/ChooseRole";
import Products from "./pages/user/Products";
import VendorEditProduct from "./pages/vendor/VendorProductEdit";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/*vendor routes */}
        <Route
          path="/vendor"
          element={
            <ProtectedRoute allowedRoles={["ROLE_VENDOR"]}>
              <VendorLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<VendorDashboard />} />
          <Route path="products" element={<ProductPage />} />
          <Route path="add-product" element={<VendorProductForm />} />
          <Route path="product/:id" element={<VendorViewProduct />} />
          <Route path="product/edit/:id" element={<VendorEditProduct />} />
        </Route>
        {/* Public  routes*/}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        {/* user routes */}
        <Route path="/user/products" element={<Products />} />
        {/* auth routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route
            path="complete-profile"
            element={
              <ProtectedRoute allowedRoles={["ROLE_VENDOR", "ROLE_USER"]}>
                <CompleteProfile />
              </ProtectedRoute>
            }
          />
          <Route path="signup" element={<ChooseRole />} />
          <Route path="signup/user" element={<SignUp role="ROLE_USER" />} />

          <Route path="signup/vendor" element={<SignUp role="ROLE_VENDOR" />} />
          <Route
            path="vendor-onboarding"
            element={
              <ProtectedRoute allowedRoles={["ROLE_VENDOR"]}>
                <VendorOnBoarding />
              </ProtectedRoute>
            }
          />
          <Route path="otp-verify" element={<OtpVerify />} />
          <Route path="oauth-success" element={<OAuthSuccess />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
