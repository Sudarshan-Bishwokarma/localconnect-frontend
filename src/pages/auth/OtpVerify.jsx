import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

const OtpVerify = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || localStorage.getItem("otpEmail");
  useEffect(() => {
    if (!email) {
      toast.error("Session Expired");
      navigate("/login");
    } else {
      setTimer(30);
      setIsTimerActive(true);
    }
  }, [email, navigate]);
  // set TimeOut
  useEffect(() => {
    if (!isTimerActive) return;

    if (timer <= 0) {
      setIsTimerActive(false);
      return;
    }
    const timeout = setTimeout(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [timer, isTimerActive]);
  // handle   change
  const handleChange = (e) => {
    setOtp(e.target.value);
  };
  //  handle resend
  const handleResend = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:8080/api/auth/resend-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        },
      );
      let result;
      try {
        result = await response.json();
      } catch {
        result = { message: "Something went wrong" };
      }
      if (response.ok) {
        toast.success(result.message || "OTP sent again");
        setTimer(30);
        setIsTimerActive(true);
      } else {
        const getError = result?.data?.code;
        if (getError == "USER_NOT_FOUND") {
          toast.error("You  are not registered Yet.");
          navigate("/signup");
        } else if (getError == "VERIFIED") {
          toast.error("You are already verified. Please Login");
          navigate("/login");
        } else {
          toast.error("OTP Failed. Try Again");
        }
      }
    } catch (error) {
      toast.error("Server Error");
    } finally {
      setLoading(false);
    }
  };
  //  validation
  const validate = (value) => {
    if (!value.trim()) return "OTP is required";
    if (!/^[0-9]+$/.test(value)) return "Only numbers allowed";
    if (value.length !== 6) return "OTP must be 6 digits";
    return "";
  };
  const handleVerify = async (e) => {
    e.preventDefault();
    const validateError = validate(otp);
    if (validateError) {
      setError(validateError);
      return;
    }
    setError("");
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
          }),
        },
      );

      let result;
      try {
        result = await response.json();
      } catch {
        result = { message: "Something went Wrong " };
      }
      if (response.ok) {
        toast.success(result.message);
        localStorage.removeItem("otpEmail");
        navigate("/login");
      } else {
        const error = result?.data?.code;
        if (error == "VERIFIED") {
          toast.error("Already Verified!!");
          navigate("/login");
        } else if (error == "OTP_EXPIRED") {
          toast.error("OTP is  expired. PLease resend OTP! ");
        } else if (error == "INVALID_OTP") {
          toast.error("Invalid OTP");
        }
      }
    } catch (error) {
      toast.error("Server Error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen  flex justify-center items-center">
      <div>
        <h1 className="text-2xl font-bold text-center mb-4">
          OTP Verification
        </h1>
        <form onSubmit={handleVerify} className="flex flex-col gap-6">
          <input
            type="text"
            placeholder="Enter  OTP Here "
            value={otp}
            onChange={handleChange}
            className="border p-2 "
          />
          {error && <p className=" text-red-500 text-sm">{error}</p>}
          <button
            disabled={loading}
            type="submit"
            className="bg-blue-600 text-white p-2  hover:bg-blue-700 rounded "
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>
        {/* resend  botton */}
        <div className="mt-4 text-center">
          {timer > 0 ? (
            <p className="text-gray-500">Resend in {timer}</p>
          ) : (
            <button
              disabled={loading}
              className="p-2 text-blue-500 hover:underline"
              onClick={handleResend}
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default OtpVerify;
