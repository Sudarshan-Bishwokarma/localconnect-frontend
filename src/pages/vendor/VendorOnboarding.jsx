import { useRef, useState } from "react";
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
import { FiImage } from "react-icons/fi";

const VendorOnBoarding = () => {
  const [businessData, setBusinessData] = useState({
    businessName: "",
    businessType: "",
    businessAddress: "",
    businessDescription: "",
    businessPhone: "",
    businessEmail: "",
    businessWebsite: "",
  });
  const [document, setDocument] = useState(null);
  const fileRef = useRef(null);
  // handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBusinessData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <div className="max-w-xl">
      <div className="flex items-start  gap-5 mb-3">
        <span className="  bg-white/40 h-10 w-10 p-2 rounded-2xl flex  items-center  justify-center">
          <FaBriefcase className="  text-white text-2xl " />
        </span>
        <div>
          <h1 className="font-semibold text-2xl text-center">
            Business Verification
          </h1>
          <p className="text-gray-200 text-sm p-1">
            Complete your business profile to start selling on our platform.
          </p>
        </div>
      </div>
      <form className=" grid  grid-cols-1 gap-3">
        {/* business name*/}
        <div className="grid grid-cols-[65px_1fr]  gap-3">
          <div className="mt-3 h-12 w-12 rounded-2xl p-2 bg-white/10">
            <FaBuilding className=" text-3xl text-white" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-800 ">
              Business name
            </label>
            <input
              type="text"
              name="businessName"
              value={businessData.businessName}
              placeholder="Enter your business Name..."
              className=" bg-white/80 w-full border border-white/40 rounded-xl  outline-none focus:ring-2 focus:ring-blue-500 p-2"
              onChange={handleChange}
            />
          </div>
        </div>
        {/* business type */}
        <div className="grid grid-cols-[65px_1fr] gap-3 ">
          <div className="w-12 h-12  rounded-2xl p-2 bg-white/10">
            <FaBriefcase className="text-white text-3xl" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-800 ">
              Business Type
            </label>
            <input
              type="text"
              name="businessType"
              value={businessData.businessType}
              placeholder="Enter your business type..."
              className="w-full bg-white/80 border border-white/40  rounded-xl outline-none focus:ring-2 focus:ring-blue-500 p-2"
              onChange={handleChange}
            />
          </div>
        </div>
        {/* business Address*/}
        <div className="grid  grid-cols-[65px_1fr] gap-3">
          <div className="h-12 w-12 rounded-2xl   p-2  bg-white/10 ">
            <FaMapMarkerAlt className="text-white text-3xl" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-800 ">
              Business Address
            </label>
            <input
              type="text"
              name="businessAddress"
              value={businessData.businessAddress}
              placeholder="Enter  your Business address"
              className=" bg-white/80 w-full border border-white/40  rounded-xl outline-none focus:ring-2 focus:ring-blue-500 p-2"
              onChange={handleChange}
            />
          </div>
        </div>
        {/* business description*/}
        <div className="grid grid-cols-[60px_1fr] gap-3">
          <div className="h-12 w-12 p-2 bg-white/10 rounded-2xl">
            <FaFileAlt className="text-white text-3xl" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-800 ">
              Business description
            </label>
            <textarea
              name="businessDescription"
              value={businessData.businessDescription}
              placeholder="Describe your business..."
              className="w-full  bg-white/80 border border-white/40  rounded-xl outline-none focus:ring-2 focus:ring-blue-500 py-1 "
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {/* business phoneNumber*/}
          <div className="grid grid-cols-[60px_1fr] gap-3">
            <div className="h-12 w-12 rounded-2xl bg-white/10 p-2">
              <FaPhone className="text-white text-3xl" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-800 ">
                Business number
              </label>
              <input
                type="number"
                name="businessPhone"
                value={businessData.businessPhone}
                placeholder="Enter phone number"
                className="w-full bg-white/80 border border-white/40 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 p-2"
                onChange={handleChange}
              />
            </div>
          </div>
          {/* business email*/}
          <div className="grid grid-cols-[60px_1fr] gap-3">
            <div className="h-12 w-12 rounded-2xl p-2 bg-white/10">
              <FaEnvelope className="text-3xl text-white" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-800 ">
                Business Email
              </label>
              <input
                type="email"
                name="businessEmail"
                value={businessData.businessEmail}
                placeholder="Enter business email"
                className="w-full bg-white/80 border border-white/40  rounded-xl outline-none focus:ring-2 focus:ring-blue-500 p-2"
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {/* business  website */}
          <div className="grid grid-cols-[60px_1fr] gap-3">
            <div className="h-12 w-12 p-2  rounded-2xl bg-white/10">
              <FaGlobe className="text-white text-3xl" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-800 ">
                Website(Optional)
              </label>
              <input
                type="text"
                name="businessWebsite"
                value={businessData.businessWebsite}
                placeholder="Enter website URL"
                className="w-full  bg-white/80 border border-white/40  rounded-xl outline-none focus:ring-2 focus:ring-violet-500 p-2"
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
                    <FiImage className="text-blue-600 text-2xl" />
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
            </div>
          </div>
        </div>
        {/*  submit*/}
        <button className="bg-blue-600 p-2 text-white border-white/40  rounded-2xl">
          Submit for review
        </button>
      </form>
      <p className="text-xs mt-2 text-center text-gray-300">
        We will review your information and get back to you soon.
      </p>
    </div>
  );
};
export default VendorOnBoarding;
