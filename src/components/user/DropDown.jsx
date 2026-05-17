import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";

const DropDown = () => {
  const [open, setOpen] = useState(false);
  const toggleDropDown = () => {
    setOpen(!open);
  };
  return (
    <div className="relative">
      <button onClick={toggleDropDown}>
        <FaUserCircle className="text-2xl cursor-pointer" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-4 z-50 w-[180px] bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
          <ul>
            <li className="px-8 py-2 cursor:pointer hover:bg-gray-200">
              Profile
            </li>
            <li className="px-8 py-2 cursor:pointer hover:bg-gray-200">
              Settings
            </li>
            <li className="px-8 py-2 cursor:pointer hover:bg-gray-200">
              Logout
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
export default DropDown;
