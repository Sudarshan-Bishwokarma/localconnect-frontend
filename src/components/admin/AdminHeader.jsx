import logo from "../../assets/local_connect_logo.png";
import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";
import UserDropdown from "./UserDropdown";
import NotificationBell from "./NotificationBell";
const AdminHeader = () => {
  return (
    <>
      <header className="flex  items-center justify-between h-[90px]  w-full bg-black  px-5">
        {/*   logo */}
        <div className="h-[50px] w-[120px] ">
          <img src={logo} alt="logo" className="h-full w-full object-cover" />
        </div>
        {/*   search section */}
        <div className="flex items-center h-[50px] w-[300px] bg-white border border-black rounded px-2">
          <input
            type="text"
            placeholder="Search here..... "
            className="w-full outline-none  bg-transparent"
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
export default AdminHeader;
