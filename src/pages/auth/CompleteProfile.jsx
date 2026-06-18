import { useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  FaCamera,
  FaEnvelope,
  FaEye,
  FaGlobe,
  FaImage,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaUser,
  FaUserCircle,
  FaUserEdit,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CountrySelect from "../../data/CountrySelect";
const CompleteProfile = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    number: "",
    city: "",
    country: "",
  });
  const fileRef = useRef(null);
  const [profile, setProfile] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  //  handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // hande=le skip
  const handleSkip = (e) => {
    if (role === "ROLE_VENDOR") {
      navigate("/vendor/dashboard");
    } else {
      navigate("/user/products");
    }
  };
  // handle errors
  const handlErrors = (e) => {
    const err = {};
    if (!profileData.number.trim()) {
      err.number = "Number is required";
    } else if (!/^\d+$/.test(profileData.number)) {
      err.number = "Only numbers are allowed";
    } else if (profileData.number.length < 10) {
      err.number = "Number must be at least 10 digits";
    }
    if (!profileData.city.trim()) {
      err.city = "City is required";
    }
    if (!profileData.country.trim()) {
      err.country == "Country is  required";
    }
    if (!profile) {
      err.profile = "Profile image is required";
    }
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validateErrors = handlErrors();
    setErrors(validateErrors);
    if (Object.keys(validateErrors).length > 0) return;
    try {
      setLoading(true);
      const fData = new FormData();
      fData.append("city", profileData.city);
      fData.append("country", profileData.country);
      fData.append("number", profileData.number);
      if (profile) {
        fData.append("profile", profile);
      }
      const response = await fetch(
        "http://localhost:8080/api/complete-profile",
        {
          method: "PUT",

          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: fData,
        },
      );
      const result = await response.json();
      if (response.ok) {
        const message = result.data;
        toast.success(message);
        if (role === "ROLE_VENDOR") {
          navigate("/auth/vendor-onboarding");
        } else {
          navigate("/home");
        }
        setProfileData({
          number: "",
          city: "",
          country: "",
          bio: "",
        });
        setProfile(null);
        setPreview(null);
        if (fileRef.current) {
          fileRef.current.value = "";
        }
        setErrors({});
      } else {
        const message = result?.data?.code;
        if (message === "USER_NOT_FOUND") toast.error("User not found");
        if (message === "PROFILE_NOT_FOUND")
          toast.error("Profile upload failed");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className=" w-full max-w-xl py-3">
      <div className="flex gap-5 items-start ">
        <FaUserCircle className="text-white text-6xl" />
        <div className="space-y-1">
          <h1 className="font-semibold text-center text-2xl tracking-tight">
            Let's Get to Know You.
          </h1>
          <p className="text-gray-200 text-sm leading-relaxed ">
            Please fill in the details below to complete your profile
          </p>
        </div>
      </div>

      <form className="grid grid-cols-1 gap-2 mt-3" onSubmit={handleSubmit}>
        {/* preview */}
        <div>
          <label className=" block text-sm  text-center font-medium text-gray-800">
            Profile Preview
          </label>
          <div className=" relative  flex items-center justify-center overflow-hidden  mt-2">
            {preview ? (
              <img
                src={preview}
                alt="profile preview "
                className="   h-24 w-24 object-cover rounded-full border-2 border-white/40"
              />
            ) : (
              <div className="relative">
                <div className="absolute bottom-0 right-0 rounded-full border border-white/80 bg-white p-2">
                  <FaCamera className=" text-gray-500 text-xl" />
                </div>
                <FaUserCircle className="text-white/70 text-8xl" />
              </div>
            )}
          </div>
          <p className="text-center   text-sm text-white/60 leading-relaxed ">
            Your profile picture will appear here.
          </p>
        </div>

        {/* phone number and address */}
        <div className="grid grid-cols-2 gap-4">
          {/*  phone  number*/}
          <div>
            <label className="text-sm font-medium  text-gray-800">
              Phone number
            </label>
            <div className="relative">
              <FaPhoneAlt className="absolute text-xl text-gray-500  top-1/2 -translate-y-1/2 left-3" />
              <input
                type="tel"
                name="number"
                value={profileData.number}
                placeholder="Enter you phone number"
                className="w-full  bg-white/80 border border-white/40  rounded-xl p-2 pl-10  focus:ring-2 focus:ring-blue-400 focus:border-transparent transition shadow-sm outline-none"
                onChange={handleChange}
              />
            </div>
            <p className="h-[16px] text-sm text-red-300 ">{errors.number}</p>
          </div>
          {/* address */}
          <div>
            <label className="text-sm font-medium  text-gray-800">City</label>
            <div className="relative">
              <FaMapMarkerAlt className="absolute text-xl text-gray-500  top-1/2 -translate-y-1/2 left-3" />
              <input
                type="text"
                name="city"
                value={profileData.city}
                placeholder="Enter your city"
                className="w-full  bg-white/80 border border-white/40  rounded-xl p-2 pl-10  focus:ring-2 focus:ring-blue-400 focus:border-transparent transition shadow-sm outline-none"
                onChange={handleChange}
              />
            </div>
            <p className="h-[16px] text-sm text-red-300 ">{errors.city}</p>
          </div>
        </div>
        {/* country*/}
        <div>
          <label className="text-sm font-medium  text-gray-800">Country</label>
          <div className="relative text-center ">
            <FaGlobe className="z-10 absolute text-xl top-1/2  -translate-y-1/2   left-3 text-gray-500" />
            <CountrySelect
              value={profileData.country}
              onChange={(country) => {
                setProfileData((prev) => ({
                  ...prev,
                  country,
                }));
              }}
            />
          </div>
        </div>
        {/* upload profile section */}
        <div>
          <label className="text-sm font-medium text-gray-800 text-center">
            Profile Picture
          </label>
          <input
            type="file"
            ref={fileRef}
            className=""
            hidden
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setProfile(file);
                setPreview(URL.createObjectURL(file));
              }
            }}
          />
          <div
            onClick={() => {
              fileRef.current.click();
            }}
            className="flex justify-between items-center  px-2 py-3  border border-white/40 bg-white/80 rounded-2xl  outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent "
          >
            {/* left content */}
            <div className="flex  items-center gap-10">
              <FaCamera className="text-4xl text-gray-400" />
              <div className="text-center">
                <p className="text-slate-700 text-xs font-semibold">
                  {profile ? profile.name : "Upload your  profile"}
                </p>
                <p className="text-slate-700 text-xs font-semibold">
                  JPEG,PNG,JPG(MAX.3MB)
                </p>
              </div>
            </div>
            {/*right content */}
            <div>
              <button
                type="button"
                className="bg-blue-500 text-white px-1 py-2 rounded-xl"
              >
                Choose File
              </button>
            </div>
          </div>
          <p className="text-red-300  h-[16px] ">{errors.profile}</p>
        </div>
        {/*   save  and skip*/}
        <div className="flex  justify-between mt-2">
          {/* skip*/}
          <div>
            <button
              type="button"
              onClick={handleSkip}
              className="  bg-white/10 py-3 px-2 text-white/80  border border-white/80   cursor-pointer rounded-2xl hover:bg-white/20 transition"
            >
              Skip for now
            </button>
          </div>

          {/* save*/}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 py-3 px-2 text-white  border border-white/30   cursor-pointer rounded-2xl hover:bg-blue-500 hover:scale-[1.02] transition"
            >
              Save & Continue
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default CompleteProfile;
