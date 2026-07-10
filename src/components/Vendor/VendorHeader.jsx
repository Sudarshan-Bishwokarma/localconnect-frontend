import logo from "../../assets/Final_Logo.png";
import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";
import UserDropdown from "./UserDropdown";
import NotificationBell from "./NotificationBell";
import { FaBars } from "react-icons/fa";
const VendorHeader = ({ setSideBarOpen }) => {
  return (
    <>
      <header className="flex  items-center justify-between h-[90px]  fixed top-0 z-50 w-full bg-white text-gray-700 px-5  shadow-sm">
        <button
          onClick={() => setSideBarOpen(true)}
          className="md:hidden text-2xl text-gray-700"
        >
          <FaBars />
        </button>
        {/*   logo */}
        <div className="h-[50px] w-[120px]  mx-auto md:mx-0">
          <img src={logo} alt="logo" className="h-full w-full object-cover" />
        </div>
        {/*   search section */}
        <div className=" hidden md:flex items-center h-[50px] w-[300px] bg-white border-2 border-black rounded-xl px-2">
          <input
            type="text"
            placeholder="Search here..... "
            className="w-full outline-none   bg-transparent"
          />
          <FaSearch className="text-2xl text-gray-600" />
        </div>
        {/* actions area */}
        <div className="flex items-center gap-10">
          <NotificationBell />
          <UserDropdown />
        </div>
      </header>
    </>
  );
};
export default VendorHeader;
