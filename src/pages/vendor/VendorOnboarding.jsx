import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  FaBuilding,
  FaStore,
  FaMapMarkerAlt,
  FaBriefcase,
  FaAlignLeft,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaFileUpload,
  FaFileAlt,
  FaPaperPlane,
} from "react-icons/fa";
import { FaFileCircleExclamation } from "react-icons/fa6";
import { FiImage } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const VendorOnBoarding = () => {
  const [businessData, setBusinessData] = useState({
    businessName: "",
    businessType: "",
    businessAddress: "",
    businessDescription: "",
    businessPhoneNumber: "",
    documentType: "",
    businessEmail: "",
    businessWebsite: "",
  });
  const [loading, setLoading] = useState(false);
  const [document, setDocument] = useState(null);
  const fileRef = useRef(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [businessCategories, setBusinessCatregories] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchBusinessType();
  }, []);

  // fetch categories
  const fetchBusinessType = async () => {
    try {
      console.log("Fetching categories...");
      const response = await fetch("http://localhost:8080/api/all-categories");
      const result = await response.json();
      if (response.ok) {
        setBusinessCatregories(result.data);
      } else {
        toast.error("Fetch to failed  Business Categories");
      }
    } catch (error) {
      console.log(error);
    }
  };
  // handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBusinessData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // haldle errrors
  const handleErrors = () => {
    const err = {};
    if (!businessData.businessName.trim()) {
      err.businessName = "Business name is reqired";
    }
    if (!businessData.businessType.trim()) {
      err.businessType = "Business type is required";
    }
    if (!businessData.businessAddress.trim()) {
      err.businessAddress = "Business address is required";
    }
    if (!businessData.businessDescription) {
      err.businessDescription = "Business description is needed";
    }
    if (!businessData.businessPhoneNumber.trim()) {
      err.businessPhoneNumber = "Business phone number is required";
    } else if (!/^(98|97)\d{8}$/.test(businessData.businessPhoneNumber)) {
      err.businessPhoneNumber = "Enter a valid Nepali mobile number";
    }
    if (!businessData.documentType.trim()) {
      err.documentType = "Document Type is needed.";
    }
    if (!document) {
      err.document = "Document is reqired";
    }

    if (!businessData.businessEmail.trim()) {
      err.businessEmail = "Business email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(businessData.businessEmail)) {
      err.businessEmail = "Enter a valid email address";
    }
    return err;
  };
  // handle submit
  const handleSumbit = async (e) => {
    e.preventDefault();
    const allErrors = handleErrors();
    setErrors(allErrors);
    if (Object.keys(allErrors).length > 0) {
      return;
    }
    try {
      const vendorProfile = new FormData();
      vendorProfile.append("businessName", businessData.businessName);
      vendorProfile.append("categoryId", businessData.businessType);
      vendorProfile.append("businessAddress", businessData.businessAddress);
      vendorProfile.append(
        "businessDescription",
        businessData.businessDescription,
      );
      vendorProfile.append("businessPhone", businessData.businessPhoneNumber);
      vendorProfile.append("documentType", businessData.documentType);
      vendorProfile.append("businessEmail", businessData.businessEmail);
      vendorProfile.append("businessWebsite", businessData.businessWebsite);
      vendorProfile.append("document", document);

      const response = await fetch(
        "http://localhost:8080/api/vendor/complete/business-profile",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: vendorProfile,
        },
      );
      const result = await response.json();
      if (response.ok) {
        navigate("/vendor/dashboard");
        localStorage.setItem(
          "businessStatus",
          JSON.stringify(result.data.businessProfileCompleted),
        );
        toast.success(result.message);
        setBusinessData({
          businessName: "",
          businessType: "",
          businessAddress: "",
          businessDescription: "",
          businessPhoneNumber: "",
          documentType: "",
          businessEmail: "",
          businessWebsite: "",
        });

        setDocument(null);
        if (fileRef.current) {
          fileRef.current.value = "";
        }
        setErrors({});
      } else {
        const errMsg = result?.data?.code;
        if (errMsg === "USER_NOT_FOUND") {
          navigate("/auth/signup");
          toast.error("Vendor not Found");
        } else if (errMsg === "PROFILE_ALREADY_EXISTS") {
          navigate("/vendor/dashboard");
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl">
      <div className="flex items-start  gap-5 mb-1">
        <span className="  bg-white/40 h-12  w-12  p-2 rounded-2xl flex  items-center  justify-center">
          <FaBriefcase className=" text-white text-5xl " />
        </span>
        <div>
          <h1 className="font-semibold text-2xl text-center">
            Business Verification
          </h1>
          <p className="text-gray-200 text-sm leading-relaxed">
            Complete your business profile to start selling on our platform.
          </p>
        </div>
      </div>
      <form className=" grid  grid-cols-1  mt-6" onSubmit={handleSumbit}>
        {/* biusiness  name and address */}
        <div className="grid grid-cols-2 gap-3">
          {/* business name*/}
          <div className="">
            <label className="text-sm font-medium text-gray-800  ">
              Business Name
            </label>
            <div className="relative">
              <FaBuilding className=" absolute text-lg text-gray-500 top-1/2 -translate-y-1/2 left-3" />
              <input
                type="text"
                name="businessName"
                value={businessData.businessName}
                placeholder="Enter Business Name"
                className=" bg-white/80 w-full border border-white/40 rounded-xl  shadow-sm outline-none focus:ring-2 focus:ring-blue-400 focus:ring-border-transparent pl-10 p py-2"
                onChange={handleChange}
              />
            </div>
            <p className="text-red-500 text-sm h-[16px]">
              {errors.businessName}
            </p>
          </div>
          {/* business Address*/}
          <div className="">
            <label className="text-sm font-medium text-gray-800 ">
              Business Address
            </label>
            <div className="relative">
              <FaMapMarkerAlt className="absolute text-lg text-gray-500 top-1/2 -translate-y-1/2 left-3" />
              <input
                type="text"
                name="businessAddress"
                value={businessData.businessAddress}
                placeholder="Enter  Business Address"
                className="  w-full bg-white/80 border border-white/40  rounded-xl shadow-sm  outline-none focus:ring-2 focus:ring-blue-400  focus:border-transparent transition-all duration-300 pl-10  py-2 "
                onChange={handleChange}
              />
            </div>
            <p className="text-red-500 text-sm h-[16px]">
              {errors.businessAddress}
            </p>
          </div>
        </div>
        {/* business type */}
        <div className="">
          <label className="text-sm font-medium text-gray-800 ">
            Business Type
          </label>
          <div className="relative">
            <FaBriefcase className="absolute text-lg text-gray-500 top-1/2 -translate-y-1/2 left-3" />
            <select
              name="businessType"
              value={businessData.businessType}
              placeholder="Enter your business type..."
              className=" text-gray-600 w-full bg-white/80 border border-white/40  rounded-xl shadow-sm  outline-none focus:ring-2 focus:ring-blue-400  focus:border-transparent transition-all duration-300 pl-10  py-2"
              onChange={handleChange}
            >
              <option value="">Select Business Type</option>
              {businessCategories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                  className="text-center"
                >
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>
          <p className="text-red-700 text-sm h-[16px]">{errors.businessType}</p>
        </div>

        {/* business description*/}
        <div>
          <label className="text-sm font-medium text-gray-800 ">
            Business Description
          </label>
          <div className="relative">
            <FaFileAlt className="absolute text-lg text-gray-500 top-2 left-3" />
            <textarea
              name="businessDescription"
              value={businessData.businessDescription}
              placeholder="Describe your business..."
              className="w-full  bg-white/80 border border-white/40  rounded-xl outline-none focus:ring-2 focus:ring-blue-400  focus:border-transparent transition-all duration-300 pl-10 pt-2 "
              onChange={handleChange}
            ></textarea>
          </div>
          <p className="text-red-700 text-sm h-[16px]">
            {errors.businessDescription}
          </p>
        </div>
        {/* bisiness phone nunber and business email */}
        <div className="grid grid-cols-2 gap-3">
          {/* business phone Number*/}
          <div className="">
            <label className="text-sm font-medium text-gray-800 ">
              Business number
            </label>
            <div className="relative">
              <FaPhone className="absolute text-lg text-gray-500 top-1/2 -translate-y-1/2 left-3" />
              <input
                type="number"
                name="businessPhoneNumber"
                value={businessData.businessPhoneNumber}
                placeholder="Enter phone number"
                className=" w-full bg-white/80 border border-white/40  rounded-xl shadow-sm  outline-none focus:ring-2 focus:ring-blue-400  focus:border-transparent transition-all duration-300 pl-10  py-2 "
                onChange={handleChange}
              />
            </div>
            <p className="text-red-700 text-sm h-[16px]">
              {errors.businessPhoneNumber}
            </p>
          </div>
          {/* business email*/}
          <div className="">
            <label className="text-sm font-medium text-gray-800">
              Business Email
            </label>
            <div className="relative">
              <FaEnvelope className="absolute text-lg text-gray-500 top-1/2 -translate-y-1/2 left-3" />
              <input
                type="email"
                name="businessEmail"
                value={businessData.businessEmail}
                placeholder="Enter business email"
                className=" w-full bg-white/80 border border-white/40  rounded-xl shadow-sm  outline-none focus:ring-2 focus:ring-blue-400  focus:border-transparent transition-all duration-300 pl-10  py-2 "
                onChange={handleChange}
              />
            </div>
            <p className="text-red-700 text-sm h-[16px]">
              {errors.businessEmail}
            </p>
          </div>
        </div>
        {/* business DocumentType */}
        <div className="">
          <label className="text-sm font-medium text-gray-800 ">
            Document Type
          </label>
          <div className="relative">
            <FaFileAlt className="absolute text-lg text-gray-500 top-1/2 -translate-y-1/2 left-3" />
            <select
              name="documentType"
              value={businessData.documentType}
              className=" text-gray-600 w-full bg-white/80 border border-white/40  rounded-xl shadow-sm  outline-none focus:ring-2 focus:ring-blue-400  focus:border-transparent transition-all duration-300 pl-10  py-2"
              onChange={handleChange}
            >
              <option value="">Select Document Type</option>
              <option value="PAN_VAT">PAN/VAT</option>
              <option value="BUSINESS_REGISTRATION">
                BUSINESS REGISTRATION
              </option>
              <option value="LICENSE">LICESNE</option>
            </select>
            <p className="text-red-700 text-sm h-[16px]">
              {errors.documentType}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {/* business  website */}
          <div className="">
            <label className="text-sm font-medium text-gray-800 ">
              Website(Optional)
            </label>
            <div className="relative">
              <FaGlobe className="absolute text-lg text-gray-500 top-1/2 -translate-y-1/2 left-3" />
              <input
                type="text"
                name="businessWebsite"
                value={businessData.businessWebsite}
                placeholder="Enter website URL"
                className="w-full  bg-white/80 border border-white/40  rounded-xl outline-none focus:ring-2 focus:ring-blue-400  focus:border-transparent transition-all duration-300 pl-10  py-2 "
                onChange={handleChange}
              />
            </div>
          </div>
          {/* business  document */}
          <div className="grid grid-cols-1 ">
            <div>
              <label className="text-sm font-medium text-gray-800 ">
                Business Document/License
              </label>
              <input
                type="file"
                ref={fileRef}
                accept="image/**"
                hidden
                onChange={(e) => {
                  setDocument(e.target.files[0]);
                }}
                className="w-full  bg-white/80 border border-white/40  rounded-xl outline-none focus:ring-2 focus:ring-violet-500 p-2"
              />
              {/* upload  box */}
              <div
                onClick={() => {
                  fileRef.current.click();
                }}
                className=" flex items-center justify-between border border-white/40 bg-white/80  rounded-2xl focus:ring-2 focus:ring:blue-500 hover:cursor-pointer "
              >
                <div className=" flex items-center gap-5  ">
                  <div className=" w-[30px] bg-blue/40 p-3 rounded-full">
                    <FiImage className="text-gray-500 text-2xl" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-slate-700 font-semi-bold text-xs">
                      {document ? document.name : "  Upload document"}
                    </p>
                  </div>
                </div>
                {/* right content */}
                <button
                  type="button"
                  className=" mr-2 bg-blue-500 border border-white/10 rounded-xl text-white text-xs p-2"
                >
                  choose file
                </button>
              </div>
              <p className="text-red-700 text-sm h-[16px]">{errors.document}</p>
            </div>
          </div>
        </div>
        {/*  submit*/}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 p-2 text-white border-white/40  rounded-2xl  hover:bg-white-600 hover:scale-[1.02] outline-none focus:ring-2 focus:ring-blue-500 border border-transparent   cursor pointer transition-all mt-2 "
        >
          Submit for review
        </button>
      </form>
    </div>
  );
};
export default VendorOnBoarding;
