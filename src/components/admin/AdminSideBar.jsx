const AdminSideBar = () => {
  return (
    <div className="min-h-full w-[250px]  bg-slate-900 text-gray-300  p-4  ">
      <ul className=" flex flex-col gap-3">
        <li className="px-3 py-2 rounded hover:bg-slate-800 cursor-pointer">
          Dashboard
        </li>
        <li className="px-3 py-2 rounded hover:bg-slate-800 cursor-pointer">
          Products
        </li>
        <li className="px-3 py-2 rounded hover:bg-slate-800 cursor-pointer">
          Vendors
        </li>

        <li className="px-3 py-2 rounded hover:bg-slate-800 cursor-pointer">
          Orders
        </li>
        <li className="px-3 py-2 rounded hover:bg-slate-800 cursor-pointer">
          Users
        </li>
      </ul>
    </div>
  );
};
export default AdminSideBar;
