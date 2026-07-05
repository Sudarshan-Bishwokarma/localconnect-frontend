import { useState } from "react";
import { FaEye, FaLock } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { HiOutlineMail } from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // validation
  const validate = () => {
    const err = {};
    if (!user.email.trim()) {
      err.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(user.email)) {
      err.email = "Invalid Email Format";
    }
    if (!user.password.trim()) {
      err.password = "Password is required";
    } else if (user.password.length < 6) {
      err.password = "Password must be  at least 6 characters";
    }
    return err;
  };
  //  check  business  profile  status
  const checkBusinessStatus = async (token) => {
    try {
      const res = await fetch(
        "http://localhost:8080/api/vendor/business-status",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await res.json();

      if (!res.ok) return false;

      const status = result?.data?.businessProfileStatus;

      console.log("Extracted business status:", status);

      return status === true;
    } catch (error) {
      console.log("ERROR:", error);
      return false;
    }
  };
  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault(); // used to stop the browser’s default behavior
    const validateErrors = validate();
    setErrors(validateErrors);
    if (Object.keys(validateErrors).length > 0) return;
    const email = user.email;
    try {
      setLoading(true);

      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      let result;
      result = await response.json();
      console.log("LOGIN RESPONSE BODY:", result);
      if (response.ok) {
        // store JWT token
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("role", result.data.role);
        localStorage.setItem("profileStatus", result.data.status);

        const role = result.data.role;
        const status = result?.data?.status;
        const token = result?.data?.token;
        const businessStatus = await checkBusinessStatus(token);
        localStorage.setItem("businessStatus", JSON.stringify(businessStatus));
        console.log(businessStatus);
        if (status === "PENDING") {
          toast.error("You  have not  completed your profile yet.");
          navigate("/auth/complete-profile");
        } else {
          if (role === "ROLE_USER") {
            toast.success("Login Successful");
            navigate("/user/products");
          } else {
            if (businessStatus) {
              toast.success("Login Successful");
              navigate("/vendor/dashboard");

              console.log(businessStatus);
            } else {
              toast.error("/Complete your  profile");
              navigate("/auth/vendor-onboarding");
            }
          }
        }

        // reset Form
        setUser({
          email: "",
          password: "",
        });
        setErrors({});
      } else {
        const code = result?.data?.code;
        if (code == "INVALID_CREDENTIALS") {
          toast.error("Invalid email or password");
        } else if (code == "NOT_VERIFIED") {
          toast.error("Yor are not  verified yet.");
          localStorage.setItem("otpEmail", email);
          navigate("/auth/otp-verify", { state: { email } });
        } else {
          toast.error(result.message || "Login Failed");
        }
      }
    } catch (error) {
      toast.error("Server error. Try again later.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className=" w-full  max-w-xl mt-2">
      <div className="flex flex-col gap-2  mt-2 ">
        <h1 className="text-2xl font-semibold text-center">Welcome Back!</h1>
        <p className=" text-center text-gray-200 text-sm">
          Login to your account and continue your LocalConnect journey
        </p>
      </div>
      <form className=" grid grid-cols-1 gap-3  mt-7" onSubmit={handleSubmit}>
        {/* email */}
        <div>
          <div className="relative">
            <HiOutlineMail className=" absolute  top-1/2  -translate-y-1/2 text-lg text-gray-500 left-3" />

            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="border  border-white/40  rounded-xl pl-10 pr-3 py-3  w-full  bg-white/90 shadow-sm  outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent  "
            />
          </div>

          <p className="text-red-500 text-sm h-[18px]">{errors.email} </p>
        </div>
        {/* passoword */}
        <div>
          <div className="relative">
            <FaLock className="absolute  text-gray-500 top-1/2 -translate-y-1/2 left-3 text-lg" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={user.password}
              onChange={handleChange}
              placeholder="Enter your passsword "
              className="border  border-white/40  rounded-xl pl-10 pr-3 py-3  w-full  bg-white/90 shadow-sm  outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent  "
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className=" absolute top-1/2  -translate-y-1/2 right-3 text-black "
            >
              {showPassword ? <FaRegEyeSlash /> : <FaEye />}
            </span>
          </div>
          <p className="text-red-500 text-sm min-h-[18px]">{errors.password}</p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 p-2 rounded-lg hover:bg-blue-600 transition font-medium disabled:bg-gray-400  disabled:cursor-not-allowed  text-white/80"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      {/* forget */}
      <p className="text-end text-xs mt-2">
        <span className="text-white/80  cursor-pointer hover:underline">
          <Link> Forget password?</Link>
        </span>
      </p>
      {/*OR*/}
      <div className="flex  items-center gap-1 mt-3">
        <div className=" flex-1 border-t border-white/10"></div>
        <span className="text-white/80">OR</span>
        <div className=" flex-1 border-t border-white/10"></div>
      </div>
      {/* google login */}
      <div className="relative mt-3">
        <FcGoogle className=" absolute  top-1/2 -translate-y-1/2 left-12 text-2xl" />
        <button
          type="button"
          onClick={() =>
            (window.location.href =
              "http://localhost:8080/oauth2/authorization/google")
          }
          className=" w-full text-center  p-3 bg-white/80 rounded-xl hover:bg-white cursor-pointe transition-all"
        >
          Login with Google
        </button>
      </div>
      {/* dont have an account */}
      <div className="mb-3">
        <p className="text-center text-white/50 text-sm mt-4">
          Don't have an account?{""}{" "}
          <span className="text-white/80 font-semibold cursor-pointer hover:underline">
            SignUp
          </span>
        </p>
      </div>
    </div>
  );
};
export default Login;
