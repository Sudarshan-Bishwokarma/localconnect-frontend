import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaEye, FaRegEyeSlash, FaLock } from "react-icons/fa";
import { HiUserGroup, HiOutlineUser, HiOutlineMail } from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
const SignUp = ({ role }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowpassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  // handle  input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
    //  remove error for that field
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  //  validation
  const validate = () => {
    const err = {};
    if (!user.name.trim()) err.name = " Name is required";
    if (!user.email.trim()) {
      err.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(user.email)) {
      err.email = "Invalid email format";
    }
    if (!user.password.trim()) {
      err.password = "Password is required";
    } else if (user.password.length < 6) {
      err.password = "Password must be at least 6 characters";
    }
    if (!user.confirmPassword.trim()) {
      err.confirmPassword = "Confirm  password is   required";
    } else if (user.password.trim() !== user.confirmPassword.trim()) {
      err.confirmPassword = "Password  do not match";
    }

    return err;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validateErrors = validate();
    setErrors(validateErrors);
    if (Object.keys(validateErrors).length > 0) return;

    try {
      setLoading(true);
      const { confirmPassword, ...userData } = user;
      const payload = {
        ...userData,
        roleType: role,
      };

      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      let result;
      try {
        result = await response.json();
      } catch {
        toast.error("Something went wrong");
      }

      if (response.ok) {
        toast.success(result.data);
        localStorage.setItem("otpEmail", user.email);
        navigate("/auth/otp-verify", {
          state: { email: user.email },
        });

        // reset form
      } else {
        const code = result?.data?.code;
        if (code == "USER_ALREADY_EXISTS") {
          toast.error("User Already exists.");
          console.log(" User already exists.");
          navigate("/auth/login");
        } else {
          toast.error(result.message || "Signup failed");
          console.log(" SignUp Failed.");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl">
      <div className="flex items-start gap-5 mb-3">
        <div className="bg-white/40 h-12 w-12 p-2 rounded-2xl">
          <HiUserGroup className="text-black text-3xl" />
        </div>
        <div>
          <h1 className="font-semibold text-2xl text-center">Create Account</h1>
          <p className="text-gray-200 text-sm p-1">
            Join LocalConnect and start your journey
          </p>
        </div>
      </div>
      <div>
        <form className="  grid grid-cols-1 gap-3 " onSubmit={handleSubmit}>
          {/* Full Name */}
          <div>
            <div className="relative">
              <HiOutlineUser className="absolute top-1/2 -translate-y-1/2  left-3 text-gray-500 text-lg  " />
              <input
                type="text"
                name="name"
                placeholder=" Enter your full name"
                value={user.name}
                onChange={handleChange}
                className="border  border-white/40  rounded-xl pl-10 pr-3 py-3  w-full  bg-white/90 shadow-sm  outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            </div>
            <p className="text-red-500 text-sm h-[18px]">{errors.name}</p>
          </div>
          {/* Email */}
          <div>
            <div className="relative  ">
              <HiOutlineMail className=" absolute top-1/2 -translate-y-1/2 left-3 text-gray-500 text-lg " />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={user.email}
                onChange={handleChange}
                className="border  border-white/40  rounded-xl pl-10 pr-3 py-3  w-full  bg-white/90 shadow-sm  outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent  "
              />
            </div>

            <p className="text-sm text-red-500 h-[18px]">{errors.email}</p>
          </div>
          {/* Password */}
          <div>
            <div className="relative">
              <FaLock className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-500 text-lg" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={user.password}
                onChange={handleChange}
                className="border  border-white/40  rounded-xl pl-10 pr-3 py-3  w-full  bg-white/90 shadow-sm  outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
              <span
                onClick={() => setShowpassword(!showPassword)}
                className="absolute  right-3 top-1/2 -translate-y-1/2 cursor-pointer text-black"
              >
                {showPassword ? <FaRegEyeSlash /> : <FaEye />}
              </span>
            </div>

            <p className="text-sm text-red-500 h-[18px]">{errors.password}</p>
          </div>
          {/*   confirm pssword */}
          <div>
            <div className="relative">
              <FaLock className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-500 text-lg" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Re-enter your password"
                value={user.confirmPassword}
                onChange={handleChange}
                className="border  border-white/40  rounded-xl pl-10 pr-3 py-3  w-full  bg-white/90 shadow-sm  outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-black"
              >
                {showConfirmPassword ? <FaRegEyeSlash /> : <FaEye />}
              </span>
            </div>

            <p className="text-sm text-red-500 h-[18px]">
              {errors.confirmPassword}
            </p>
          </div>
          {/* submit */}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white p-2 rounded-xl hover:bg-blue-600 hover:scale-[1.02] transition-all  disabled:bg-gray-400"
          >
            {loading ? "Registering..." : "Create Account"}
          </button>
        </form>
        <p className="text-center text-white/50 text-sm mt-3">
          By creating an account you agree to our <br />
          <span className="text-white/80 font-semibold cursor-pointer hover:underline">
            Terms of Service
          </span>
          {""} and {""}
          <span className="text-white/80 font-semibold cursor-pointer hover:underline">
            Privacy Policy
          </span>
        </p>
        {/*OR */}
        <div className="flex  items-center  mt-3 gap-1">
          <div className=" flex-1  border-t border-white/10"></div>
          <span className="text-white/80">OR</span>
          <div className="flex-1  border-t border-white/10"></div>
        </div>
        {/*  login with google */}
        <div className="relative mt-3">
          <FcGoogle className=" absolute  top-1/2 -translate-y-1/2 left-12 text-2xl" />
          <button
            type="button"
            onClick={() =>
              (window.location.href =
                "http://localhost:8080/oauth2/authorization/google")
            }
            className=" w-full text-center   p-3 bg-white/80 rounded-xl hover:bg-white cursor-pointe transition-all
    duration-300 shadow-lg"
          >
            Login with Google
          </button>
        </div>
        {/*Already */}
        <p className="text-center text-white/50 text-sm mt-2">
          Already have an account? {""}
          <span className=" font-semibold cursor-pointer hover:underline">
            Login
          </span>
        </p>
      </div>
    </div>
  );
};
export default SignUp;
