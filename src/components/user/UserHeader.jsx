import { FaSearch, FaShoppingCart } from "react-icons/fa";
import logo from "../../assets/Final_Logo.png";
import UserNotificationBell from "./UserNotificationBell";
import DropDown from "./DropDown";
import { Link } from "react-router-dom";
const UserHeader = () => {
  return (
    <header className="flex  items-center justify-between h-[100px]  w-full bg-white text-gray-700 px-5  shadow-sm ">
      {/*logo*/}
      <div className="h-[70px] w-[150px]">
        <img src={logo} alt="logo" className="h-full w-full object-cover" />
      </div>
      {/*links */}
      <div>
        <div className=" flex items-center gap-15  text-2xl text-black  cursor-pointer">
          <Link to="/explore-nepal" className="hover:text-blue-600 transition">
            Explore Nepal
          </Link>
          <Link to="/orders" className="hover:text-blue-600 transition">
            My Orders
          </Link>
          <Link to="/signup" className="hover:text-blue-600 transition">
            SignUp
          </Link>
          <Link to="/login" className="hover:text-blue-600 transition">
            Login
          </Link>
        </div>
      </div>
      {/*search section */}
      <div className=" flex  items-center h-[50px] w-[300px] bg-white border-2 border-black rounded px-2">
        <input
          type="text"
          placeholder="Search here......."
          className=" flex-1 bg-transparent outline-none"
        />
        <FaSearch className="text-2xl text-gray-600" />
      </div>
      {/*actions area */}
      <div className="flex items-center gap-10 mx-5">
        <Link to="/cart">
          <FaShoppingCart className="text-black text-2xl" />
        </Link>
        <UserNotificationBell />
        <DropDown />
      </div>
    </header>
  );
};
export default UserHeader;
