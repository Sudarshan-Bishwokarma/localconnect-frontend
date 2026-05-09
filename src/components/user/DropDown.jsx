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
        <FaUserCircle className="text-2xl" />
      </button>
      {open && (
        <div className=" absolute w-[150px] rounded right-0 mt-3 rounded text-black shadow-lg  ">
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
