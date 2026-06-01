import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";

const AddProductForm = () => {
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
    <div className="min-h-full bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-8">
      <div className=" bg-white rounded-2xl shadow-sm p-5">
        <h1 className="text-center text-2xl mb-4 font-bold mb-5">
          Add Product Here....
        </h1>
        <form
          className="flex flex-col gap-3 w-[400px] "
          onSubmit={handleSubmit}
        >
          <div>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              placeholder="Enter product name here...."
              className="border rounded p-2 w-full outline-none bg-transparent"
              onChange={handleChange}
            />
            <p className="text-red-500 text-sm min-h-[18px]">
              {errors.productName}
            </p>
          </div>
          <div>
            <input
              type="number"
              name="productPrice"
              value={formData.productPrice}
              placeholder="Enter product price here...."
              className="border rounded p-2 w-full outline-none bg-transparent"
              onChange={handleChange}
            />
            <p className="text-red-500 text-sm min-h-[18px]">
              {errors.productPrice}
            </p>
          </div>
          <div>
            <textarea
              name="productDescription"
              value={formData.productDescription}
              placeholder="Enter description here.........."
              className="border
            rounded p-2 w-full  outline-none bg-transparent"
              onChange={handleChange}
            ></textarea>
            <p className="text-red-500 text-sm min-h-[18px]">
              {errors.productDescription}
            </p>
          </div>
          {/* select categories */}
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
          <div>
            <input
              type="file"
              ref={fileRef}
              accept="image/*"
              hidden
              onChange={(e) => {
                setFile(e.target.files[0]);
              }}
            />
            <button
              type="button"
              onClick={() => fileRef.current.click()}
              className="bg-blue-500  px-4 py-2 rounded-xl w-full text-white hover:text-black transition"
            >
              {file ? file.name : "Upolad product Image"}
            </button>
            <p className=" text-red-500 text-sm min-h-[16px]"> {errors.file}</p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-3 py-2 bg-blue-500 rounded-xl text-white hover:text-black flex-wrap"
          >
            {loading ? "Adding Product" : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};
export default AddProductForm;
