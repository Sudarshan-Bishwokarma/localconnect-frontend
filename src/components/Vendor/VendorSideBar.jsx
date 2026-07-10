import { Link } from "react-router-dom";
import { FiHome, FiUsers, FiBox, FiShoppingCart, FiUser } from "react-icons/fi";
const VendorSideBar = ({ sideBarOpen, setSideBarOpen }) => {
  return (
    <div
      className={`fixed left-0 z-50 top-[90px] h-[calc(100vh-90px)] ${sideBarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transform transition-transform duration-300 ease-in-out w-[250px]  bg-slate-900 text-gray-300  p-5 `}
    >
      <button
        onClick={() => setSideBarOpen(false)}
        className="md:hidden text-white text-2xl mb-2"
      >
        ✕
      </button>
      <ul className=" flex flex-col gap-3">
        <Link to="/vendor">
          <li className="px-3 py-2 rounded hover:bg-slate-800 cursor-pointer flex items-center gap-3 ">
            <FiHome className="text-lg mb-1" />
            <span>Dashboard</span>
          </li>
        </Link>
        <Link to="/vendor/products">
          <li className="px-3 py-2 rounded hover:bg-slate-800 cursor-pointer flex items-center gap-3">
            <FiBox className="text-lg" />
            <span>Products</span>
          </li>
        </Link>

        <li className="px-3 py-2 rounded hover:bg-slate-800 cursor-pointer flex items-center gap-3">
          <FiShoppingCart className="text-lg" />
          <span> Orders</span>
        </li>
        <li className="px-3 py-2 rounded hover:bg-slate-800 cursor-pointer flex items-center gap-3">
          <FiUser className="text-lg" />
          <span> Users</span>
        </li>
      </ul>
    </div>
  );
};
export default VendorSideBar;
