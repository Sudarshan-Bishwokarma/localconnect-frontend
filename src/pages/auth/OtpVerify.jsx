import { ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  const otpRef = useRef([]);
  const email = location.state?.email || localStorage.getItem("otpEmail");
  useEffect(() => {
    if (!email) {
      toast.error("Session Expired");
      navigate("/auth/login");
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
  // OTP input handling
  const handleChange = (e, index) => {
    const value = e.target.value;

    // only numbers allowed
    if (!/^\d*$/.test(value)) return;

    const newOtp = otp.split("");

    newOtp[index] = value;

    const finalOtp = newOtp.join("");

    setOtp(finalOtp);

    // move forward
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
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
        navigate("/auth/login");
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
    <div className="w-full max-w-xl">
      <div className="flex flex-col  items-center justify-center gap-3 mt-2">
        <ShieldCheck className="text-white" size={80} />
        <div>
          <h1 className="text-2xl font-bold text-center">OTP Verification</h1>
          <p className="text-sm text-center text-gray-800">
            We have sent a Verification code to your email.
          </p>
          <p className="text-sm text-center text-gray-700">
            Please enter the 6-digit code below.
          </p>
        </div>
      </div>

      <form onSubmit={handleVerify} className="grid grid-cols-1 mt-4">
        <div className="flex justify-center gap-4">
          {[...Array(6)].map((_, index) => (
            <input
              type="text"
              key={index}
              maxLength={1}
              ref={(el) => (otpRef.current[index] = el)}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="
                w-14 h-14
                rounded-2xl
                border border-gray-300
                bg-white
                text-center
                text-2xl
                font-bold
                shadow-sm
                outline-none
                transition
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-200
              "
            />
          ))}
        </div>

        {error && <p className=" text-red-500 text-sm">{error}</p>}
        <button
          disabled={loading}
          type="submit"
          className="bg-blue-600 text-white p-2  hover:bg-blue-700 rounded  mt-7"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
      {/* resend  botton */}
      <div className="mt-4 text-center">
        {timer > 0 ? (
          <p className="text-white/400">Resend in {timer}</p>
        ) : (
          <button
            disabled={loading}
            className="p-2 text-white/80  hover:underline"
            onClick={handleResend}
          >
            Resend OTP
          </button>
        )}
      </div>
    </div>
  );
};
export default OtpVerify;
