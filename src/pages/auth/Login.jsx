import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
      try {
        result = await response.json();
      } catch (err) {
        result = { message: "Something is wrong" };
      }
      if (response.ok) {
        // store JWT token
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("role", result.data.role);
        toast.success(result.message);

        // reset Form
        setUser({
          email: "",
          password: "",
        });
        setErrors({});
      } else {
        const code = result.data?.code;
        if (code == "INVALID_CREDENTIALS") {
          toast.error("Invalid email or password");
        } else if (code == "NOT_VERIFIED") {
          toast.error("Yor are not  verified yet.");
        } else {
          toast.error(result.message || "Login Failed");
        }
      }
    } catch (error) {
      toast.error("Server error. Try again later.");
      console.log("error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="w-full  max-w-md p-5 rounded-lg shadow ">
        <h1 className="text-2xl text-center font-bold mb-5">Login Here</h1>
        <form className=" flex  flex-col gap-6 " onSubmit={handleSubmit}>
          <input
            type="text"
            name="email"
            value={user.email}
            onChange={handleChange}
            className="border p-2 rounded  w-full"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email} </p>
          )}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={user.password}
              onChange={handleChange}
              className="border p-2 rounded  w-full"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password} </p>
            )}
            <span
              onClick={() => setShowPassword(!showPassword)}
              className=" absolute top-2.5 right-2 text-black "
            >
              {showPassword ? <FaRegEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 p-2 rounded hover:bg-blue-600 transition disabled:bg-gray-400  disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};
export default Login;
