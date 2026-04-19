import { Outlet } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import AdminSideBar from "./AdminSideBar";
import Footer from "../common/Footer";

const AdminLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />

      <div className="flex flex-1 items-stretch">
        <AdminSideBar />

        <div className="flex-1 p-6 min-h-full">
          <Outlet />
        </div>
      </div>

      <Footer />
    </div>
  );
};
export default AdminLayout;
