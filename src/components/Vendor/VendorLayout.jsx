import { Outlet } from "react-router-dom";
import Footer from "../common/Footer";
import VendorHeader from "./VendorHeader";
import VendorSideBar from "./VendorSideBar";
import { useState } from "react";

const VendorLayout = () => {
  const [sideBarOpen, setSideBarOpen] = useState(false);
  return (
    <div className="flex flex-col min-h-screen  pt-[90px]">
      <VendorHeader setSideBarOpen={setSideBarOpen} />

      <div className=" flex flex-1 items-stretch">
        {/* Mobile overlay */}
        {sideBarOpen && (
          <div
            onClick={() => setSideBarOpen(false)}
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
          />
        )}
        <VendorSideBar
          sideBarOpen={sideBarOpen}
          setSideBarOpen={setSideBarOpen}
        />

        <div className="flex-1 p-6 min-h-full md:ml-[250px]">
          <Outlet />
        </div>
      </div>

      <Footer />
    </div>
  );
};
export default VendorLayout;
