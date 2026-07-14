import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  FaBox,
  FaCamera,
  FaEdit,
  FaEye,
  FaLayerGroup,
  FaMapMarkerAlt,
  FaPalette,
  FaRuler,
  FaRupeeSign,
  FaTag,
  FaUserCircle,
} from "react-icons/fa";
import { FiFileText } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

const VendorEditProduct = () => {
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState({
    productName: "",
    productDescription: "",
    categoryId: "",
    districtId: "",
    hasVariants: false,
    price: "",
    stock: "",
    variants: [],
  });
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [variantImagePreview, setVariantImagePreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const mainFileRef = useRef(null);
  const variantRef = useRef([]);
  const [categories, setCategories] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [errors, setErrors] = useState({});

  const [productDetails, setProductDetails] = useState({});
  const { id } = useParams();
  const [deletedVariantIds, setDeletedVariantIds] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchDistricts();
  }, []);
  // fetch  products details
  useEffect(() => {
    fetchProductDetails(id);
  }, [id]);
  // fetch Product Details
  const fetchProductDetails = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/product/${id}`);
      const result = await response.json();
      if (response.ok) {
        const product = result.data;
        setProductDetails(product);
        setFormData({
          productName: product.productName,
          productDescription: product.productDescription,
          categoryId: product.categoryId,
          districtId: product.districtId,
          hasVariants: product.hasVariants,
          price: product.productPrice,
          stock: product.stock,
          variants: (product.variantsDetails || []).map((variant) => ({
            ...variant,
            image: null,
            preview: "",
          })),
        });
        console.log(result.data);
      } else {
        const errorMsg = result?.data?.code;
        if (errorMsg == "PRODUCT_NOT_FOUND") {
          toast.error("Product Not Found");
        } else {
          toast.error("Something went wrong");
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  // fetch all categories
  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/all-categories");
      const result = await response.json();
      if (response.ok) {
        setCategories(result.data);
      } else {
        toast.error("Failed to fetch the categories");
      }
    } catch (error) {
      console.log(error);
    }
  };
  // fetch all districts
  const fetchDistricts = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/all-districts");
      const result = await response.json();
      if (response.ok) {
        setDistricts(result.data);
      } else {
        toast.error("Failed to fetch Districts");
      }
    } catch (error) {
      console.log(error);
    }
  };
  // handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // handle variant change
  const handleVariantChange = (i, e) => {
    const { name, value } = e.target;
    const updated = [...formData.variants];
    updated[i][name] = value;
    setFormData((prev) => ({
      ...prev,
      variants: updated,
    }));
  };
  // handle add variant
  const handleAddVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          id: null,
          size: "",
          color: "",
          price: "",
          stock: "",
          variantImageBase64: "",
          image: "",
          preview: "",
        },
      ],
    }));
    toast.success("New Variant added.");
  };
  // handle remove variant
  const handleRemoveVariant = (index) => {
    if (formData.variants.length === 1) {
      toast.error("Product must have at least one variant");
      return;
    }

    const variant = formData.variants[index];

    if (variant.id) {
      setDeletedVariantIds((prev) => [...prev, variant.id]);
    }

    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  // validation
  const validate = () => {
    const err = {};

    // product  name
    if (!formData.productName.trim()) {
      err.productName = "Product name is required";
    } else if (formData.productName.length < 3) {
      err.productName = "Product name must contain at least 3 characters";
    } else if (formData.productName.length > 100) {
      err.productName = "Product name cannot exceed 100 characters";
    }

    // description

    if (!formData.productDescription.trim()) {
      err.productDescription = "Product description is required";
    } else if (formData.productDescription.length < 20) {
      err.productDescription = "Description must contain minimum 20 characters";
    } else if (formData.productDescription.length > 600) {
      err.productDescription = "Description cannot exceed 600 characters";
    }

    // category
    if (!formData.categoryId) {
      err.categoryId = "Category is required";
    }

    // district

    if (!formData.districtId) {
      err.districtId = "District is required";
    }

    // main image

    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

      if (!allowedTypes.includes(file.type)) {
        err.file = "Only JPG, JPEG and PNG images are allowed";
      }

      if (file.size > 3 * 1024 * 1024) {
        err.file = "Image size must be less than 3MB";
      }
    }

    // simple product

    if (!formData.hasVariants) {
      if (!formData.price) {
        err.price = "Price is required";
      } else if (isNaN(formData.price)) {
        err.price = "Price must be a number";
      } else if (Number(formData.price) <= 0) {
        err.price = "Price must be greater than zero";
      }

      if (!formData.stock) {
        err.stock = "Stock is required";
      } else if (!Number.isInteger(Number(formData.stock))) {
        err.stock = "Stock must be whole number";
      } else if (Number(formData.stock) < 0) {
        err.stock = "Stock cannot be negative";
      }
    }

    // variant  product

    if (formData.hasVariants) {
      if (formData.variants.length === 0) {
        err.variants = "At least one variant is required";
      }

      formData.variants.forEach((v, index) => {
        // size

        if (!v.size.trim()) {
          err[`variant_${index}_size`] = "Size is required";
        }

        // color

        if (!v.color.trim()) {
          err[`variant_${index}_color`] = "Color is required";
        }

        // price

        if (!v.price) {
          err[`variant_${index}_price`] = "Price is required";
        } else if (isNaN(v.price)) {
          err[`variant_${index}_price`] = "Price must be number";
        } else if (Number(v.price) <= 0) {
          err[`variant_${index}_price`] = "Price must be greater than zero";
        }

        // stock

        if (!v.stock) {
          err[`variant_${index}_stock`] = "Stock is required";
        } else if (!Number.isInteger(Number(v.stock))) {
          err[`variant_${index}_stock`] = "Stock must be whole number";
        } else if (Number(v.stock) < 0) {
          err[`variant_${index}_stock`] = "Stock cannot be negative";
        }

        if (!v.id && !v.image) {
          err[`variant_${index}_image`] = "New variant image is required";
        }

        if (v.image) {
          const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

          if (!allowedTypes.includes(v.image.type)) {
            err[`variant_${index}_image`] = "Only JPG JPEG PNG allowed";
          }

          if (v.image.size > 3 * 1024 * 1024) {
            err[`variant_${index}_image`] = "Image must be below 3MB";
          }
        }
      });
    }

    return err;
  };
  /// handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validate();
    setErrors(validation);

    if (Object.keys(validation).length > 0) return;

    try {
      setLoading(true);
      const productData = {
        productName: formData.productName,
        productDescription: formData.productDescription,
        categoryId: Number(formData.categoryId),
        districtId: Number(formData.districtId),
        hasVariants: formData.hasVariants,
        price: formData.hasVariants ? null : Number(formData.price),
        stock: formData.hasVariants ? null : Number(formData.stock),
        variants: formData.hasVariants
          ? formData.variants.map((variant) => ({
              variantId: variant.variantId ?? variant.id,

              size: variant.size,
              color: variant.color,
              price: Number(variant.price),
              stock: Number(variant.stock),
            }))
          : [],
        deletedVariantIds: deletedVariantIds,
      };
      const data = new FormData();

      data.append(
        "product",
        new Blob([JSON.stringify(productData)], { type: "application/json" }),
      );

      if (file) {
        data.append("productImage", file);
      }

      formData.variants.forEach((variant, index) => {
        if (variant.image) {
          const variantId = variant.variantId ?? variant.id;

          if (variantId) {
            data.append(`variantImage_${variantId}`, variant.image);
          } else {
            data.append(`newVariantImage_${index}`, variant.image);
          }
        }
      });
      const response = await fetch(
        `http://localhost:8080/api/vendor/update-product/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        },
      );
      const result = await response.json();
      if (response.ok) {
        toast.success("Products Updated Successfully");
      } else {
        toast.error("Failed");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <h1 className="flex  items-center justify-center text-xl gray-gray-500">
        Loading...
      </h1>
    );
  }

  return (
    <div className="">
      {/*  top  part */}
      <div>
        {/*  buttons*/}
        <div className=" flex justify-between items-center ">
          <button
            className="text-gray-600 hover:text-black font-medium  hover:cursor-pointer"
            onClick={() => navigate(-1)}
          >
            {" "}
            ← Back to products
          </button>
          <button className="flex items-center gap-3 border  p-3 rounded-xl cursor-pointer hover:bg-gray-100 hover:scale-[1.02] transition">
            <FaEye /> Preview Product
          </button>
        </div>
        <div className="flex gap-3 items-start mt-5 ">
          <FaEdit className="text-3xl text-gray-500 " />
          <div>
            <h1 className="text-gray-800 font-semibold text-3xl">
              Edit Product
            </h1>
            <p className="leading-relaxed">
              Update your product details and manange your variants
            </p>
          </div>
        </div>
      </div>
      {/*  edit   product details  */}
      <form
        className="border border-gray-200 shadow-lg rounded-xl p-5"
        onSubmit={handleSubmit}
      >
        <div className=" flex md:flex-row  justify-between  ">
          {/* image details  */}
          <div className=" w-full md:w-1/3 p-4 flex flex-col border border-gray-100 shadow-sm  rounded-xl">
            <h1 className="text-gray-800 font-semibold text-xl mb-2">
              Product Image
            </h1>
            {productDetails?.productImageBase64 && (
              <img
                src={
                  imagePreview
                    ? imagePreview
                    : `data:image/jpeg;base64,${productDetails.productImageBase64}`
                }
                className="h-60 w-full rounded-xl object-cover"
                alt="Product"
              />
            )}
            {/* change immage */}
            <div className="mt-3">
              {" "}
              <input
                type="file"
                hidden
                ref={mainFileRef}
                onChange={(e) => {
                  const selectedFile = e.target.files[0];
                  if (selectedFile) {
                    setFile(selectedFile);
                    setImagePreview(URL.createObjectURL(selectedFile));
                  }
                }}
              />
              <div
                className="flex  flex-col border  border-gray-300 rounded-xl p-3  hover:cursor-pointer"
                onClick={() => mainFileRef.current?.click()}
              >
                <div className="flex justify-center items-center gap-3 ">
                  <FaCamera className="text-lg text-gray-500" />
                  <p className="text-sm text-gray-700">
                    {file ? file.name : "Change Image"}
                  </p>
                </div>
                <p className="text-center leading-relaxed text-sm">
                  JPG,PNG,JPEG(Max 5MB)
                </p>
              </div>
            </div>
          </div>
          {/*   edit  product details */}
          <div className="w-full md:w-2/3 p-4">
            <h1 className="font-semibold text-lg">Product Information</h1>
            <div className=" grid grid-cols-1 border border-gray-200  rounded-xl shadow-sm mt-2 p-4">
              {/*  product name */}
              <div>
                <div>
                  <label className="text-gray-800 font-semibold">
                    Product Name
                  </label>
                  <div className="relative">
                    <FaTag className=" absolute text-gray-500  top-1/2 -translate-y-1/2 left-3 text-lg" />
                    <input
                      name="productName"
                      type="text"
                      value={formData.productName}
                      onChange={handleChange}
                      className="border  border-gray-500  rounded-xl pl-10  py-3  w-full  bg-white shadow-sm  outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition  "
                      placeholder="Product Name"
                    />
                  </div>
                </div>
                <p className="text-red-500 text-sm h-[18px]">
                  {errors.productName}
                </p>
              </div>

              {/* Product Description */}
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
              {/* category and description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-800 font-semibold">
                    Category
                  </label>
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
                  <p className="text-sm text-red-500 h-[18px]">
                    {errors.categoryId}
                  </p>
                </div>

                <div>
                  <label className="text-gray-800 font-semibold">
                    District
                  </label>
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
                  <p className="text-sm text-red-500 h-[18px]">
                    {errors.districtId}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* if simple product */}
        {!formData.hasVariants && (
          <div className="grid grid-cols-1  md:grid-cols-2 gap-3 mt-5">
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
        {/*  if prouct has variant  */}
        {productDetails?.hasVariants && (
          <div className="border border-gray-100 shadow-lg  rounded-xl p-5 mt-5">
            <div className="flex justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full  bg-gray-100 p-3  border border-gray-300">
                  {" "}
                  <FaLayerGroup className="text-gray-500 text-xl" />
                </div>
                <div>
                  <h1 className="font-semibold text-gray-800">
                    Product Variants
                  </h1>
                  <p className="text-xs md:text-sm leading-relaxed">
                    Manage your product Variants(size,color,price,stock etc..
                  </p>
                </div>
              </div>
              {/* add new  variant button */}
              <div>
                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="border border-gray-200 bg-white  p-3 cursor-pointer rounded-xl hover:bg-gray-100 hover:scale-[1.02]"
                >
                  + Add new Variant
                </button>
              </div>
            </div>
            {/* variant box  */}
            <div className=" mt-3 space-y-4">
              {formData.variants.map((variant, i) => (
                <div key={variant.id}>
                  <div className="border border-gray-200 rounded-xl p-5 shadow-sm">
                    <div className="flex  justify-between">
                      <h3 className="font-semibold text-gray-700 mb-4">
                        Variant #{i + 1}
                      </h3>
                      <div
                        onClick={() => handleRemoveVariant(i)}
                        className=" bg-white  cursor-pointer border border-gray-500  rounded p-2 text-red-700 hover:bg-gray-200  text-sm"
                      >
                        Remove
                      </div>
                    </div>
                    <div className=" flex  items-center  justify-between gap-5 ">
                      {/*  variantt image  an change  variant image */}
                      <div className=" w-full  md:w-50 space-y-3">
                        <div className="  border border-gray-200  rounded-lg   flex items-center  justify-center ">
                          {variant.preview || variant.variantImageBase64 ? (
                            <img
                              className="h-full w-full object-cover"
                              src={
                                variant.preview
                                  ? variant.preview
                                  : `data:image/jpeg;base64,${variant.variantImageBase64}`
                              }
                              alt="variant"
                            />
                          ) : (
                            <div className="relative">
                              <div className="absolute bottom-0 right-0 rounded-full border border-white/80 bg-white p-2">
                                <FaCamera className=" text-gray-500 text-xl" />
                              </div>
                              <FaUserCircle className="text-gray-500 text-8xl" />
                            </div>
                          )}
                        </div>
                        {/* change variant image */}
                        <div>
                          <input
                            type="file"
                            ref={(el) => (variantRef.current[i] = el)}
                            hidden
                            accept="image/png,image/jpeg,image/jpg"
                            onChange={(e) => {
                              const selectedFile = e.target.files[0];
                              if (selectedFile) {
                                const updated = [...formData.variants];
                                updated[i].image = selectedFile;
                                updated[i].preview =
                                  URL.createObjectURL(selectedFile);
                                setFormData((prev) => ({
                                  ...prev,
                                  variants: updated,
                                }));
                              }
                            }}
                          />
                          <div
                            onClick={() => variantRef.current[i]?.click()}
                            className=" flex  gap-3  p-3 items-center justify-center border  border-gray-200 rounded-xl"
                          >
                            <FaCamera className="text-gray-500" /> change Image
                          </div>
                          <p className="text-red-500">
                            {errors[`variant_${i}_image`]}
                          </p>
                        </div>
                      </div>
                      {/* all four input  */}
                      <div className=" w-full md:w-2/3 grid md:grid-cols-1">
                        {/* Sixe and  color */}
                        <div className="">
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
                                    value={variant.size}
                                    placeholder="Size"
                                    onChange={(e) => handleVariantChange(i, e)}
                                    className="w-full  border border-gray-400  rounded-xl p-3 pl-10 shadow-sm  outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition "
                                  />
                                </div>
                              </div>
                              <p className="text-red-500 h-[18px]">
                                {errors[`variant_${i}_size`]}
                              </p>
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
                                    value={variant.color}
                                    placeholder="Color"
                                    onChange={(e) => handleVariantChange(i, e)}
                                    className="w-full  border border-gray-400  rounded-xl p-3 pl-10 shadow-sm  outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition "
                                  />
                                </div>
                              </div>
                              <p className="text-red-500 h-[18px]">
                                {errors[`variant_${i}_color`]}
                              </p>
                            </div>
                          </div>
                        </div>
                        {/*  price and stock */}
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
                                  value={variant.price}
                                  placeholder="Price"
                                  onChange={(e) => handleVariantChange(i, e)}
                                  className="w-full  border border-gray-400  rounded-xl p-3 pl-10 shadow-sm  outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition "
                                />
                              </div>
                            </div>
                            <p className="text-red-500 h-[18px]">
                              {errors[`variant_${i}_price`]}
                            </p>
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
                                  value={variant.stock}
                                  placeholder="Stock"
                                  onChange={(e) => handleVariantChange(i, e)}
                                  className="w-full  border border-gray-400  rounded-xl p-3 pl-10 shadow-sm  outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition "
                                />
                              </div>
                            </div>
                            <p className="text-red-500 h-[18px]">
                              {errors[`variant_${i}_stock`]}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/*  cancel button */}
        <div className="mt-5 flex justify-end ">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 hover:cursor-pointer"
            disabled={loading}
          >
            {" "}
            {loading ? "Updating.. " : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
};
export default VendorEditProduct;
