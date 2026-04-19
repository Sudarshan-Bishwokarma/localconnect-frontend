import { useState } from "react";
import AdminHeader from "./components/admin/AdminHeader";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./components/admin/AdminLayout";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminLayout />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
