import { ArrowBigLeftIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  FaAlignLeft,
  FaArrowLeft,
  FaBoxOpen,
  FaCamera,
  FaLayerGroup,
  FaMapMarkerAlt,
  FaPalette,
  FaPlus,
  FaRuler,
  FaRupeeSign,
  FaShoppingBag,
} from "react-icons/fa";
import { FaBox } from "react-icons/fa6";
import { FiFileText, FiTag } from "react-icons/fi";
import { IoMdAddCircle } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const VendorProductForm = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const mainFileRef = useRef(null);
  const variantRef = useRef([]);

  const [formData, setFormData] = useState({
    productName: "",
    productDescription: "",
    categoryId: "",
    districtId: "",
    hasVariants: false,
    variants: [],
    price: "",
    stock: "",
  });

  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCategories();
    fetchDistricts();
  }, []);

  const fetchCategories = async () => {
    const res = await fetch("http://localhost:8080/api/all-categories");
    const data = await res.json();
    setCategories(data.data || []);
  };

  const fetchDistricts = async () => {
    const res = await fetch("http://localhost:8080/api/all-districts");
    const data = await res.json();
    setDistricts(data.data || []);
  };

  // handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;

    const updated = [...formData.variants];
    updated[index][name] = value;

    setFormData((prev) => ({
      ...prev,
      variants: updated,
    }));
  };

  // add variant
  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          size: "",
          color: "",
          price: "",
          stock: "",
          image: null,
        },
      ],
    }));
  };

  const removeVariant = (index) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  // validation
  const validate = () => {
    const err = {};

    if (!formData.productName.trim()) {
      err.productName = "Product name is required";
    } else if (formData.productName.length < 3) {
      err.productName = "Product name must be at least 3 characters";
    } else if (formData.productName.length > 100) {
      err.productName = "Product name cannot exceed 100 characters";
    }
    if (!formData.productDescription.trim()) {
      err.productDescription = "Description is required";
    } else if (formData.productDescription.length < 20) {
      err.productDescription =
        "Description must contain at least 20 characters";
    } else if (formData.productDescription.length > 600) {
      err.productDescription = "Description cannot exceed 500 characters";
    }
    if (!formData.categoryId) err.categoryId = " Category is required";
    if (!formData.districtId)
      err.districtId = "Please select product origin district";

    if (!formData.productDescription)
      err.productDescription = "Product Description is required";
    if (!formData.categoryId) err.categoryId = " Category is required";
    if (!formData.districtId) err.districtId = "District is required";
    if (!file) {
      err.file = "Product image is required";
    } else {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

      if (!allowedTypes.includes(file.type)) {
        err.file = "Only JPG, JPEG and PNG images are allowed";
      }

      if (file.size > 3 * 1024 * 1024) {
        err.file = "Image size must be less than 3MB";
      }
    }

    if (!formData.hasVariants) {
      if (!formData.price) {
        err.price = "Price is required";
      } else if (isNaN(formData.price)) {
        err.price = "Price must be a number";
      } else if (Number(formData.price) <= 0) {
        err.price = "Price must be greater than 0";
      }
      if (!formData.stock) {
        err.stock = "Stock is required";
      } else if (!Number.isInteger(Number(formData.stock))) {
        err.stock = "Stock must be a whole number";
      } else if (Number(formData.stock) < 0) {
        err.stock = "Stock cannot be negative";
      }
    }

    if (formData.hasVariants) {
      if (formData.variants.length === 0) {
        err.variants = "Add at least one variant";
      }

      formData.variants.forEach((v, index) => {
        // Size
        if (!v.size.trim()) {
          err[`variant_${index}_size`] = "Size is required";
        }

        // Color
        if (!v.color.trim()) {
          err[`variant_${index}_color`] = "Color is required";
        }

        // Price
        if (!v.price.trim()) {
          err[`variant_${index}_price`] = "Price is required";
        } else if (isNaN(v.price)) {
          err[`variant_${index}_price`] = "Price must be a number";
        } else if (Number(v.price) <= 0) {
          err[`variant_${index}_price`] = "Price must be greater than 0";
        }

        // Stock
        if (!v.stock.trim()) {
          err[`variant_${index}_stock`] = "Stock is required";
        } else if (!Number.isInteger(Number(v.stock))) {
          err[`variant_${index}_stock`] = "Stock must be a whole number";
        } else if (Number(v.stock) < 0) {
          err[`variant_${index}_stock`] = "Stock cannot be negative";
        }

        // Image
        if (!v.image) {
          err[`variant_${index}_image`] = "Variant image is required";
        } else {
          const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

          if (!allowedTypes.includes(v.image.type)) {
            err[`variant_${index}_image`] = "Only JPG, JPEG and PNG allowed";
          }

          if (v.image.size > 3 * 1024 * 1024) {
            err[`variant_${index}_image`] = "Image size must be less than 3MB";
          }
        }
      });
    }

    return err;
  };
  // handle canclel
  const handleCancel = () => {
    setFormData({
      productName: "",
      productDescription: "",
      categoryId: "",
      districtId: "",
      hasVariants: false,
      variants: [],
      price: "",
      stock: "",
    });

    setFile(null);
    setErrors({});
    if (mainFileRef.current) {
      mainFileRef.current.value = null;
    }

    variantRef.current = [];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validate();
    setErrors(validation);

    if (Object.keys(validation).length > 0) return;

    try {
      setLoading(true);

      const form = new FormData();

      // remove file from variants (IMPORTANT FIX)
      const cleanedVariants = formData.variants.map((v) => ({
        size: v.size,
        color: v.color,
        price: v.price,
        stock: v.stock,
      }));

      const payload = {
        productName: formData.productName,
        productDescription: formData.productDescription,
        categoryId: formData.categoryId,
        districtId: formData.districtId,
        hasVariants: formData.hasVariants,
        variants: cleanedVariants,
        price: formData.price,
        stock: formData.stock,
      };

      // product JSON
      form.append(
        "product",
        new Blob([JSON.stringify(payload)], {
          type: "application/json",
        }),
      );

      // main product image
      form.append("productImage", file);

      // send variant images separately
      formData.variants.forEach((v) => {
        if (v.image) {
          form.append("variantImages", v.image);
        }
      });

      const res = await fetch("http://localhost:8080/api/vendor/add-product", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Product added successfully");

        setFormData({
          productName: "",
          productDescription: "",
          categoryId: "",
          districtId: "",
          hasVariants: false,
          variants: [],
          price: "",
          stock: "",
        });

        setFile(null);
        if (mainFileRef.current) {
          mainFileRef.current.value = null;
        }

        navigate("/vendor/products");
      } else {
        toast.error(result.message || "Error");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className=" mx-auto bg-white p-3 rounded-2xl shadow-md">
      {/* heading  */}
      <div className="mb-6 px-3 py-2 bg-white  flex flex-col gap-3  justify-between sm:flex-row ">
        <div className="flex items-start gap-4">
          <FaShoppingBag className="text-blue-500 text-5xl " />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {" "}
              Add New Product
            </h1>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">
              Create and publish a new product to your catalog.
            </p>
          </div>
        </div>
        <div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className=" flex  items-center  gap-3 text-gray-600 hover:text-gray-500 hover:cursor-pointer"
          >
            {" "}
            <FaArrowLeft />
            Back to products
          </button>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* name */}
          <div>
            <div>
              <label className="text-gray-800 font-semibold">
                Product Name
              </label>
              <div className="relative">
                <FiTag className="absolute  text-gray-500 top-1/2 -translate-y-1/2 left-3 text-lg" />
                <input
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  placeholder="Product Name"
                  className="border  border-gray-500  rounded-xl pl-10  py-3  w-full  bg-white shadow-sm  outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition  "
                />
              </div>
            </div>
            <p className="text-red-500 text-sm h-[18px]">
              {errors.productName}
            </p>
          </div>

          {/* DESCRIPTION */}
          <div>
            <div>
              <label className="text-gray-800 font-semibold">
                Product Description
              </label>
              <div className="relative">
                <FiFileText className="absolute  text-gray-500 top-1/3 -translate-y-1/2 left-3 text-lg" />
                <textarea
                  name="productDescription"
                  value={formData.productDescription}
                  onChange={handleChange}
                  placeholder="Describe your product..."
                  className="border  border-gray-500  rounded-xl pl-10 pr-3 py-3  w-full  bg-white shadow-sm  outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition  "
                />
              </div>
            </div>
            <p className="text-sm text-red-500 h-[18px]">
              {errors.productDescription}
            </p>
          </div>
        </div>

        {/* CATEGORY + DISTRICT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-gray-800 font-semibold">Category</label>
            <div className="relative">
              <FaLayerGroup className="absolute  text-gray-500 top-1/2 -translate-y-1/2 left-3 text-lg" />
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="border  text-center border-gray-500  rounded-xl pl-10 pr-3 py-3  w-full  bg-white/90 shadow-sm  outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition  "
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={Number(c.id)}>
                    {c.categoryName}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-sm text-red-500 h-[18px]">{errors.categoryId}</p>
          </div>

          <div>
            <label className="text-gray-800 font-semibold">District</label>
            <div className="relative">
              <FaMapMarkerAlt className="absolute  text-gray-500 top-1/2 -translate-y-1/2 left-3 text-lg" />
              <select
                name="districtId"
                value={formData.districtId}
                onChange={handleChange}
                className="border text-center  border-gray-500  rounded-xl pl-10 pr-3 py-3  w-full  bg-white/90 shadow-sm  outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition  "
              >
                <option value="">Select District</option>
                {districts.map((d) => (
                  <option key={d.id} value={Number(d.id)}>
                    {d.districtName}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-sm text-red-500 h-[18px]">{errors.districtId}</p>
          </div>
        </div>

        {/* VARIANT TOGGLE */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.hasVariants}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                hasVariants: e.target.checked,
              }))
            }
          />
          Has Variants
        </label>

        {/* SIMPLE PRODUCT */}
        {!formData.hasVariants && (
          <div className="grid grid-cols-1  md:grid-cols-2 gap-3">
            <div>
              <div>
                <label className="text-gray-800 font-semibold">Price</label>
                <div className="relative">
                  <FaRupeeSign className="absolute  text-gray-500 top-1/2 -translate-y-1/2 left-3 text-lg" />
                  <input
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Price"
                    className="w-full  border border-gray-400  rounded-xl pl-10 p-3 shadow-sm  outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition "
                  />
                </div>
              </div>
              <p className="text-sm text-red-500 h-[18px]">{errors.price}</p>
            </div>

            <div>
              <div>
                <label className="text-gray-800 font-semibold">Stock</label>
                <div className="relative">
                  <FaBox className="absolute  text-gray-500 top-1/2 -translate-y-1/2 left-3 text-lg" />
                  <input
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="Stock"
                    className="w-full  border border-gray-400  rounded-xl p-3 pl-10 shadow-sm  outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition "
                  />
                </div>
              </div>
              <p className="text-sm text-red-500 h-[18px]">{errors.stock}</p>
            </div>
          </div>
        )}

        {/* VARIANTS */}
        {formData.hasVariants && (
          <div className="border border-gray-400 p-4 rounded-lg bg-slate-50">
            <div className="flex justify-between">
              <h1 className=" font-semibold text-xl ">Product Variants</h1>
              <button
                type="button"
                onClick={addVariant}
                className=" p-2 font-semibold text-xs rounded text-blue-600   bg-blue-500   hover:bg-blue-600 text-white hover:scale-[1.02]"
              >
                + Add Variant
              </button>
            </div>
            {/* variant vox  */}
            {formData.variants.map((v, i) => (
              <div
                key={i}
                className=" mt-3 border border-gray-500 rounded-xl  px-2 py-3 "
              >
                {/* top  part */}
                <div className="flex justify-between items-center  mb-3">
                  <h1 className="bg-blue-400 rounded p-1 text-white text-sm">
                    {" "}
                    Variant # {i + 1}
                  </h1>
                  {/* remove  button */}
                  <div>
                    <button
                      type="button"
                      onClick={() => removeVariant(i)}
                      className=" bg-white   cursor-pointer border border-gray-500  rounded p-1 text-red-700 hover:bg-gray-200  text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                {/* variant input fields */}
                <div className="grid gap-3">
                  {/* size and color */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* size*/}
                    <div>
                      <div>
                        <label className="text-gray-800 font-semibold">
                          Size
                        </label>
                        <div className="relative">
                          <FaRuler className="absolute  text-gray-500 top-1/2 -translate-y-1/2 left-3 text-lg" />
                          <input
                            name="size"
                            value={v.size}
                            onChange={(e) => handleVariantChange(i, e)}
                            placeholder="Size"
                            className="w-full  border border-gray-400  rounded-xl p-3 pl-10 shadow-sm  outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition "
                          />
                        </div>
                      </div>
                      <p className="text-red-500 h-[18px]"></p>
                    </div>
                    {/* color */}
                    <div>
                      <div>
                        <label className="text-gray-800 font-semibold">
                          Color
                        </label>
                        <div className="relative">
                          <FaPalette className="absolute  text-gray-500 top-1/2 -translate-y-1/2 left-3 text-lg" />
                          <input
                            name="color"
                            value={v.color}
                            onChange={(e) => handleVariantChange(i, e)}
                            placeholder="Color"
                            className="w-full  border border-gray-400  rounded-xl p-3 pl-10 shadow-sm  outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition "
                          />
                        </div>
                      </div>
                      <p className="text-red-500 h-[18px]"></p>
                    </div>
                  </div>

                  {/* price and  stock */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* price */}
                    <div>
                      <div>
                        <label className="text-gray-800 font-semibold">
                          Price
                        </label>
                        <div className="relative">
                          <FaRupeeSign className="absolute  text-gray-500 top-1/2 -translate-y-1/2 left-3 text-lg" />
                          <input
                            name="price"
                            value={v.price}
                            onChange={(e) => handleVariantChange(i, e)}
                            placeholder="Price"
                            className="w-full  border border-gray-400  rounded-xl p-3 pl-10 shadow-sm  outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition "
                          />
                        </div>
                      </div>
                      <p className="text-red-500 h-[18px]"></p>
                    </div>

                    {/* stock */}
                    <div>
                      <div>
                        <label className="text-gray-800 font-semibold">
                          Stock
                        </label>
                        <div className="relative">
                          <FaBox className="absolute  text-gray-500 top-1/2 -translate-y-1/2 left-3 text-lg" />
                          <input
                            name="stock"
                            value={v.stock}
                            onChange={(e) => handleVariantChange(i, e)}
                            placeholder="Stock"
                            className="w-full  border border-gray-400  rounded-xl p-3 pl-10 shadow-sm  outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition "
                          />
                        </div>
                      </div>
                      <p className="text-red-500 h-[18px]"></p>
                    </div>
                  </div>
                </div>
                {/* variant image */}
                <div>
                  <input
                    type="file"
                    hidden
                    ref={(el) => (variantRef.current[i] = el)}
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={(e) => {
                      const selectedFile = e.target.files[0];

                      if (selectedFile) {
                        const updated = [...formData.variants];

                        updated[i].image = selectedFile;

                        setFormData((prev) => ({
                          ...prev,
                          variants: updated,
                        }));
                      }
                    }}
                  />

                  <div
                    onClick={() => variantRef.current[i]?.click()}
                    className="flex  flex-col   justify-between items-center sm:flex-row gap-3  border border-gray-500 rounded-xl p-2 cursor-pointer"
                  >
                    {/* left side */}
                    <div className="flex items-center gap-3 sm:gap-10">
                      <FaCamera className="text-gray-500 text-lg" />

                      <div className="text-center">
                        <p className="text-slate-700 text-xs font-semibold">
                          {formData.variants[i].image
                            ? formData.variants[i].image.name
                            : "Upload variant image"}
                        </p>

                        <p className="text-slate-700 text-xs font-semibold">
                          JPEG, PNG, JPG (MAX.3MB)
                        </p>
                      </div>
                    </div>

                    {/* button */}
                    <button
                      type="button"
                      className="bg-blue-500 text-white p-2 rounded-xl"
                    >
                      Choose File
                    </button>
                  </div>

                  <p className="text-red-500">{errors.variants}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Product main image */}
        <div className="mt-3">
          <input
            type="file"
            hidden
            ref={mainFileRef}
            accept="image/png,image/jpeg,image/jpg"
            onChange={(e) => {
              const selectedFile = e.target.files[0];

              if (selectedFile) {
                setFile(selectedFile);
              }
            }}
          />
          <div
            onClick={() => {
              mainFileRef.current.click();
            }}
            className=" flex flex-col  gap-2 justify-between items-center sm:flex-row  w-full  border border-gray-400  p-3 border-gray-400 rounded-xl "
          >
            {/* left content */}
            <div className="flex  items-center gap-3  md:gap-10">
              <FaCamera className="text-4xl text-gray-400" />
              <div className="text-center">
                <p className="text-slate-700 text-xs font-semibold">
                  {file ? file.name : "Upload product  main image"}
                </p>
                <p className="text-slate-700 text-xs font-semibold">
                  JPEG,PNG,JPG(MAX.3MB)
                </p>
              </div>
            </div>
            {/* right content */}
            <div>
              <button
                type="button"
                className="bg-blue-500 px-2 py-2 rounded-xl hover:bg-blue-600 transition font-medium   text-white hover:cursor-pointer"
              >
                Choose file
              </button>
            </div>
          </div>
          <p className="text-sm text-red-500 h-[18px]">{errors.file}</p>
        </div>
        {/* buttons  */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 ">
          {/* Cancel */}
          <div>
            <button
              type="button"
              onClick={() => {
                console.log("CANCEL CLICKED");
                handleCancel();
              }}
              disabled={loading}
              className=" w-full bg-white border border-gray-400 p-2 rounded-lg  transition font-medium disabled:bg-gray-400  disabled:cursor-not-allowed  text-gray-500 hover:scale-[1.02] cursor-pointer"
            >
              {loading ? "Canceling... ." : "Cancel"}
            </button>
          </div>
          {/* SUBMIT */}
          <div>
            <button
              type="submit"
              onClick={(e) => {
                e.stopPropagation();
              }}
              disabled={loading}
              className=" w-full bg-blue-500 p-2 rounded-lg hover:bg-blue-600 transition font-medium disabled:bg-gray-400  disabled:cursor-not-allowed  text-white/80 hover:scale-[1.02] cursor-pointer"
            >
              {loading ? "Saving..." : "Add Product"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default VendorProductForm;
