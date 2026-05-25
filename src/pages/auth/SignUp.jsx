import { useState } from "react";
import { useRef } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaEye, FaRegEyeSlash } from "react-icons/fa";
const SignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowpassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    city: "",
    number: "",
  });
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
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
  // handle  file change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
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
    if (!user.city.trim()) err.city = "city is required";
    if (!user.number.trim()) {
      err.number = "Number is required";
    } else if (!/^\d{10}$/.test(user.number)) {
      err.number = "Enter valid 10-digit number";
    }
    if (!file) err.file = "Profile  image is  required";
    return err;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validateErrors = validate();
    setErrors(validateErrors);
    if (Object.keys(validateErrors).length > 0) return;

    try {
      setLoading(true);
      const formData = new FormData(); // FormData cannot store a JavaScript object directly it  stores key-value pairs
      const { confirmPassword, ...userData } = user; // confirmPassword is removed from userData.
      formData.append("data", JSON.stringify(userData));
      formData.append("file", file);
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        body: formData,
      });
      let result;
      try {
        result = await response.json();
      } catch {
        result = { message: "Something went wrong" };
      }

      if (response.ok) {
        toast.success(result.message);
        localStorage.setItem("otpEmail", user.email);
        navigate("/otp-verify", {
          state: { email: user.email },
        });

        // reset form
      } else {
        const code = result?.data?.code;
        if (code == "USER_ALREADY_EXISTS") {
          toast.error("User Already exists.");
          console.log(" User already exists.");
          navigate("/login");
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
    <div className="flex  items-center justify-center min-h-screen">
      <div className="p-5 w-full max-w-md shadow-md rounded-lg">
        <h1 className=" text-2xl text-center font-bold mb-5 "> SignUp Here</h1>
        <form className="flex  flex-col   gap-6  " onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Enter name here"
            value={user.name}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          <input
            type="email"
            name="email"
            placeholder="Enter email here"
            value={user.email}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter password here"
              value={user.password}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
            <span
              onClick={() => setShowpassword(!showPassword)}
              className="absolute  right-3 top-2.5 cursor-pointer text-black"
            >
              {showPassword ? <FaRegEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password}</p>
          )}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Re-enter password here"
              value={user.confirmPassword}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-2.5 cursor-pointer text-black"
            >
              {showConfirmPassword ? <FaRegEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">{errors.confirmPassword}</p>
          )}
          <input
            type="text"
            name="city"
            placeholder="Enter your address here"
            value={user.city}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
          {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
          <input
            type="text"
            name="number"
            placeholder="Enter  your number here"
            value={user.number}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
          {errors.number && (
            <p className="text-sm text-red-500">{errors.number}</p>
          )}
          <input
            type="file"
            ref={fileRef}
            accept="image/*"
            onChange={handleFileChange}
            className="border p-2 w-full rounded"
          />
          {errors.file && (
            <p className="text-red-500  text-sm">{errors.file}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition disabled:bg-gray-400"
          >
            {loading ? "Registering..." : "SignUp"}
          </button>
        </form>
      </div>
    </div>
  );
};
export default SignUp;
