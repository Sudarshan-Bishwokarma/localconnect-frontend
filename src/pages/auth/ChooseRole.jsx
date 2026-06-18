import { ArrowRight, Store, User, UserRound } from "lucide-react";
import { FaUser, FaUserPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const ChooseRole = () => {
  const navigate = useNavigate();

  return (
    <div className=" w-full max-w-xl  ">
      {/*  heading part */}
      <div className="flex flex-col  items-center gap-3  mt-3 ">
        <div className=" rounded-full bg-white/40 p-3">
          <UserRound className="text-white/80" size={45} />
        </div>
        <div className="text-center space-y-1">
          <h1 className="text-4xl font-bold  text-gray-900 tracking-tight">
            {" "}
            Choose Account Type
          </h1>
          <p className="text-sm text-gray-200 max-w-sm mx-auto leading-relaxed">
            Select how you want to continue
          </p>
        </div>
      </div>

      {/* selection   part */}
      <div className=" grid grid-cols-1  gap-5 mt-10">
        {/* select user  */}
        <button
          onClick={() => navigate("/auth/signup/user")}
          className="  group w-full flex justify-between items-center rounded-2xl px-5 py-5 bg-white shadow-md cursor-pointer hover:shadow-xl border border-transparent  hover:ring-2  hover:ring-blue-100 hover:border-blue-200  hover:scale-[1.02] transition duration-300"
        >
          <div className="rounded-full  text-white p-3 bg-gray-400">
            <User size={38} />
          </div>
          <div className="   space-y-1">
            <h1 className="font-bold text-2xl text-gray-800">
              Continue as User
            </h1>
            <p className="text-gray-500 leading-relaxed">
              Browse product, place orders, and enjoy a smooth shopping
              experience.
            </p>
          </div>
          <ArrowRight
            className=" opacity-0 group-hover:opacity-100 group-hover:translate-x-1  transition-all  duration-300    text-blue-500  "
            size={35}
          />
        </button>

        {/*select vendor */}
        <button
          onClick={() => navigate("/auth/signup/vendor")}
          className=" group  w-full flex justify-between items-center rounded-2xl px-5 py-5 bg-white shadow-md cursor-pointer hover:shadow-xl  border  border-transparent hover:ring-2 hover:ring-blue-100 hover:border-blue-200  hover:scale-[1.02] transition-all  duration-300"
        >
          <div className="rounded-full  text-white p-3 bg-gray-400">
            <Store size={38} />
          </div>
          <div className="  space-y-1">
            <h1 className="font-bold text-2xl">Continue as Vendor</h1>
            <p className="text-gray-500 leading-relaxed">
              Sell your products, grow your business, and reach more customers.
            </p>
          </div>
          <ArrowRight
            className=" opacity-0 group-hover:opacity-100 text-blue-600 group-hover:translate-x-1 transition-all duration-300 "
            size={35}
          />
        </button>
      </div>
      {/*Already a acccount */}
      <div className="flex items-center  mt-7  gap-1 ">
        <div className="flex-1  border-t border-white/40"></div>
        <p className="text-white/80"> Already have a account?</p>
        <div className="flex-1  border-t border-white/40"></div>
      </div>
      {/* login */}
      <button
        onClick={() => navigate("/auth/login")}
        className="  text-white  font-medium  mt-5 mb-3   w-full bg-blue-500 p-2 rounded-lg hover:bg-blue-600 transition-all  hover:scale-[1.02] duration-300"
      >
        Login
      </button>
    </div>
  );
};
export default ChooseRole;
