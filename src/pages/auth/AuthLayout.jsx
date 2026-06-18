import { Outlet } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import image from "../../assets/final_background.png";
import { FaHouse } from "react-icons/fa6";
const AuthLayout = () => {
  return (
    <div className=" relative min-h-screen overflow-hidden">
      <img
        src={image}
        alt="LocalConnect"
        className="absolute inset-0 w-full h-full  object-cover"
      />
      <div className=" absolute inset-0 bg-black/40"></div>

      <div className="relative  z-10   min-h-screen flex justify-between  items-start py-2 px-10">
        {/*  left content */}
        <div>
          <div className="flex  items-center items-start gap-3">
            <FaHome className="text-white text-2xl" />
            <h1 className="text-white text-xl">Local Connect</h1>
          </div>
          <div className=" flex flex-col gap-8 text-white/80 mt-20">
            <h1 className="text-6xl font-bold leading-tight">
              Grow Local. <br />
              Grow Further.
            </h1>
            <p className="">
              Join LocalConnect and become part of a thriving local <br />
              community.
            </p>
          </div>
        </div>
        {/* right  content */}

        <div className=" rounded-2xl bg-white/30  backdrop-blur-xl border border-white/20 shadow-2xl px-6 py-4 ">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
export default AuthLayout;
