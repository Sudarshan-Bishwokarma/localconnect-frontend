import { Outlet } from "react-router-dom";
import Footer from "../common/Footer";
import VendorHeader from "./VendorHeader";
import VendorSideBar from "./VendorSideBar";

const VendorLayout = () => {
  return (
    <div className="flex flex-col min-h-screen  pt-[90px]">
      <VendorHeader />

      <div className="flex flex-1 items-stretch">
        <VendorSideBar />

        <div className="flex-1 p-6 min-h-full ml-[250px]">
          <Outlet />
        </div>
      </div>

      <Footer />
    </div>
  );
};
export default VendorLayout;
