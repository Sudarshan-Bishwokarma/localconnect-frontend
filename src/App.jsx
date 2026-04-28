import { useState } from "react";
import AdminHeader from "./components/admin/AdminHeader";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import SignUp from "./pages/auth/SignUp";
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/*admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
        </Route>
        {/*    auth routes*/}
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
