import { Link } from "react-router-dom";
import { FiHome, FiUsers, FiBox, FiShoppingCart, FiUser } from "react-icons/fi";
const AdminSideBar = () => {
  return (
    <div className="min-h-full w-[250px]  bg-slate-900 text-gray-300  p-5  ">
      <ul className=" flex flex-col gap-3">
        <Link to="/admin">
          <li className="px-3 py-2 rounded hover:bg-slate-800 cursor-pointer flex items-center gap-3 ">
            <FiHome className="text-lg mb-1" />
            <span>Dashboard</span>
          </li>
        </Link>
        <Link to="/admin/products">
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
export default AdminSideBar;
