import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";
import {
  FiTag,
  FiDollarSign,
  FiFileText,
  FiMapPin,
  FiGrid,
  FiImage,
} from "react-icons/fi";

const VendorProductForm = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const [formData, setFormData] = useState({
    productName: "",
    productPrice: "",
    productDescription: "",
    categoryId: "",
    districtId: "",
  });
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    fetchDistricts();
    fetchCategories();
  }, []);
  // handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // fetch all districts
  const fetchDistricts = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/all-districts");
      const result = await response.json();
      if (response.ok) {
        setDistricts(result.data);
      } else {
        toast.error("Failed to fetch districts");
      }
    } catch (error) {
      console.log(error);
    }
  };
  // fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/all-categories");
      const result = await response.json();
      if (response.ok) {
        setCategories(result.data);
      } else {
        toast.error("Failed to fetch Categories");
      }
    } catch (error) {
      console.error(error);
    }
  };
  // handle  errors
  const validate = () => {
    const err = {};
    if (!formData.productName.trim()) {
      err.productName = "Product name is  required";
    }
    if (!formData.productPrice.trim()) {
      err.productPrice = "Product Price  is required ";
    } else if (Number(formData.productPrice) <= 0) {
      err.productPrice = "Product Price must be greater than 0";
    }
    if (!formData.productDescription.trim()) {
      err.productDescription = "Product Description is required";
    }
    if (!formData.categoryId) {
      err.categoryId = "Please select a category";
    }
    if (!formData.districtId) {
      err.districtId = "Please  select a district";
    }
    if (!file) {
      err.file = " Please  upload a image";
    }
    return err;
  };
  //  handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validateErrors = validate();
    setErrors(validateErrors);
    if (Object.keys(validateErrors).length > 0) return;

    try {
      setLoading(true);
      const fData = new FormData();
      fData.append("data", JSON.stringify(formData));
      fData.append("image", file);
      const response = await fetch(
        "http://localhost:8080/api/admin/add-product",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: fData,
        },
      );
      let result;
      try {
        result = await response.json();
      } catch {
        result = { message: "Something went wrong" };
      }
      if (response.ok) {
        toast.success(result.message);
        setFormData({
          productName: "",
          productPrice: "",
          productDescription: "",
          categoryId: "",
          districtId: "",
        });
        setFile(null);
        fileRef.current.value = "";
        setErrors({});
        navigate("/admin/products");
      } else {
        const error_msg = result?.data?.code;
        if (error_msg == "CATEGORY_NOT_FOUND") {
          toast.error("Category not  found ");
        }
        if (error_msg == "PRODUCT_ALREADY_EXIST") {
          toast.error("Product already exist");
        }
        if (error_msg == "DISTRICT_NOT_FOUND") {
          toast.error("District not  found");
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-slate-50 p-8">
      <div className=" mb-10 mt-3 px-3">
        <h1 className="text-4xl  font-bold text-gray-800 ">
          Add Product Here....
        </h1>

        <p className="text-gray-500 text-xl mt-2 max-w-3xl ">
          Create and publish products for your marketplace. Add product
          information, pricing, category, district, and upload an image to
          showcase your item professionally.
        </p>
      </div>
      <div className="bg-white rounded-3xl shadow-lg border  border-slate-200 p-8 ">
        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* product name */}
          <div className="grid grid-cols-12 gap-3 ">
            <div className="col-span-3 flex  items-center gap-4 mb-2 p-3">
              <FiTag className="text-blue-500 text-lg" />
              <label className="font-semibold text-lg text-slate-700">
                Product Name
              </label>
            </div>
            <div className="col-span-9">
              <input
                type="text"
                name="productName"
                value={formData.productName}
                placeholder="Enter product name here...."
                className="border border-gray-300 rounded p-2 w-full outline-none focus:ring-1 focus:ring-blue-500"
                onChange={handleChange}
              />
              <p className="text-red-500 text-sm min-h-[18px]">
                {errors.productName}
              </p>
            </div>
          </div>
          {/* Product Price  */}
          <div className="grid grid-cols-12 gap-3 ">
            <div className="col-span-3 flex items-center gap-4 mb-2 p-3 ">
              <FiDollarSign className="text-lg text-blue-500 " />
              <label className="text-slate-700 font-semibold text-lg">
                Product Price
              </label>
            </div>
            <div className="col-span-9">
              <input
                type="number"
                name="productPrice"
                value={formData.productPrice}
                placeholder="Enter product price here...."
                className="border rounded border-gray-300 p-2 w-full outline-none  focus:ring-1 focus:ring-blue-500 "
                onChange={handleChange}
              />
              <p className="text-red-500 text-sm min-h-[18px]">
                {errors.productPrice}
              </p>
            </div>
          </div>
          {/*  product descrition */}
          <div className="grid grid-cols-12">
            <div className="col-span-3 flex items-center mb-3 gap-3">
              <FiFileText className="text-blue-500 text-lg" />
              <label className="text-slate-700 font-semibold text-lg">
                Product Description
              </label>
            </div>
            <div className="col-span-9">
              <textarea
                name="productDescription"
                value={formData.productDescription}
                placeholder="Enter product description here.........."
                className="border
              rounded px-2 py-3 w-full  outline-none focus:ring-1 focus:ring-blue-500"
                onChange={handleChange}
              ></textarea>
              <p className="text-red-500 text-sm min-h-[18px]">
                {errors.productDescription}
              </p>
            </div>
          </div>
          {/* select categories  districts */}
          <div className="grid grid-cols-2 gap-8">
            {/* select category */}
            <div>
              <select
                name="categoryId"
                value={formData.categoryId}
                className=" text-center border rounded-xl bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
              <p className="text-red-500 text-sm min-h-[16px] ">
                {errors.categoryId}
              </p>
            </div>
            {/* select districts */}
            <div>
              <select
                name="districtId"
                value={formData.districtId}
                className=" text-center border bg-white  px-4 py-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                onChange={handleChange}
              >
                <option value=""> Select District</option>
                {districts.map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.districtName}
                  </option>
                ))}
              </select>
              <p className="text-red-500 text-sm min-h-[16px] ">
                {errors.districtId}
              </p>
            </div>
          </div>
          {/* Product Image */}
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-3 flex items-center gap-4">
              <FiImage className="text-blue-500 text-lg" />
              <label className="text-slate-700 font-semibold text-lg">
                Product Image
              </label>
            </div>

            <div className="col-span-9">
              <input
                type="file"
                ref={fileRef}
                accept="image/*"
                hidden
                onChange={(e) => {
                  setFile(e.target.files[0]);
                }}
              />

              {/* Upload Box */}
              <div
                onClick={() => fileRef.current.click()}
                className="border-2 border-dashed border-blue-300 rounded-2xl p-8 cursor-pointer hover:border-blue-500 transition bg-blue-50/30"
              >
                <div className="flex items-center justify-between">
                  {/* Left Content */}
                  <div className="flex items-center gap-5">
                    <div className="bg-blue-100 p-4 rounded-full">
                      <FiImage className="text-blue-600 text-3xl" />
                    </div>

                    <div>
                      <p className="font-semibold text-slate-700">
                        {file ? file.name : "Click to upload product image"}
                      </p>

                      <p className="text-sm text-slate-500">
                        PNG, JPG, JPEG up to 5MB
                      </p>
                    </div>
                  </div>

                  {/* Right Button */}
                  <button
                    type="button"
                    className="px-5 py-2 border border-blue-500 text-blue-600 rounded-xl hover:bg-blue-500 hover:text-white transition"
                  >
                    Choose File
                  </button>
                </div>
              </div>

              <p className="text-red-500 text-sm min-h-[16px] mt-2">
                {errors.file}
              </p>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-3 py-2 bg-blue-500 rounded-xl text-white hover:text-black flex-wrap w-full"
          >
            {loading ? "Adding Product" : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};
export default VendorProductForm;
