import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";

const UserDropdown = () => {
  const [open, setOpen] = useState(false);
  // function
  const toggleDropDown = () => {
    setOpen(!open);
  };
  return (
    <div className="relative">
      {/* User Icon*/}
      <button onClick={toggleDropDown}>
        <FaUserCircle className="text-2xl cursor-pointer text-gray-700 " />
      </button>
      {/*  drop down */}
      {open && (
        <div className="absolute  right-0 mt-3 w-[150px] bg-white  text-black rounded shadow-lg ">
          <ul>
            <li className="px-8 py-2 hover:bg-gray-200  cursor-pointer">
              Profile
            </li>
            <li className="px-8 py-2 hover:bg-gray-200 cursor-pointer">
              Settings
            </li>
            <li className="px-8 py-2 hover:bg-gray-200 cursor-pointer ">
              Logout
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
export default UserDropdown;
