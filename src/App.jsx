import { useState } from "react";
import AdminHeader from "./components/admin/AdminHeader";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import SignUp from "./pages/auth/SignUp";
import { Toaster } from "react-hot-toast";
import Login from "./pages/auth/Login";
import OtpVerify from "./pages/auth/OtpVerify";
import Home from "./pages/Home";
import ProtectedRoute from "./components/common/ProtectedRoute";
import ProductPage from "./pages/admin/ProductPage";
import AddProductForm from "./components/admin/AddProductForm";
import ViewProduct from "./pages/admin/AdminViewProduct";
import AdminViewProduct from "./pages/admin/AdminViewProduct";
function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/*admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<ProductPage />} />
          <Route path="add-product" element={<AddProductForm />} />
          <Route path="product/:id" element={<AdminViewProduct />} />
        </Route>
        {/* Auth  routes*/}
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp-verify" element={<OtpVerify />} />
        {/*  public  routes */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
