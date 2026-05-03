import { useState } from "react";

const OtpVerify = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleChange = (e) => {
    setOtp(e.target.value);
  };
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
      </div>
    </div>
  );
};
export default OtpVerify;
