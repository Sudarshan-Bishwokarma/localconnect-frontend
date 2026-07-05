import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FiTag, FiFileText, FiImage, FiPackage } from "react-icons/fi";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { FaPlus, FaTrash } from "react-icons/fa";

const VendorProductForm = () => {
  const token = localStorage.getItem("token");

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  // ADD VARIANT
  const handleAddVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        { size: "", color: "", price: "", stock: "" },
      ],
    }));
  };

  // DELETE VARIANT
  const handleDelete = (index) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const fetchDistricts = async () => {
    const res = await fetch("http://localhost:8080/api/all-districts");
    const data = await res.json();
    setDistricts(data.data || []);
  };

  const fetchCategories = async () => {
    const res = await fetch("http://localhost:8080/api/all-categories");
    const data = await res.json();
    setCategories(data.data || []);
  };

  // VALIDATION
  const validate = () => {
    const err = {};

    if (!formData.productName.trim()) err.productName = "Product name required";

    if (!formData.productDescription.trim())
      err.productDescription = "Description required";

    if (!formData.categoryId) err.categoryId = "Select category";
    if (!formData.districtId) err.districtId = "Select district";

    // SINGLE PRODUCT
    if (!formData.hasVariants) {
      if (!formData.price || formData.price <= 0)
        err.price = "Valid price required";

      if (!formData.stock || formData.stock < 0)
        err.stock = "Valid stock required";
    }

    // VARIANT PRODUCT
    if (formData.hasVariants) {
      if (formData.variants.length === 0) {
        err.variants = "Add at least one variant";
      }

      formData.variants.forEach((v, i) => {
        if (!v.price || v.price <= 0) err[`price_${i}`] = "Price required";

        if (v.stock === "" || v.stock < 0) err[`stock_${i}`] = "Stock required";
      });
    }

    if (!file) err.file = "Image required";

    return err;
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validate();
    setErrors(validation);

    if (Object.keys(validation).length > 0) return;

    const payload = {
      ...formData,
      variants: formData.hasVariants ? formData.variants : [],
    };

    try {
      setLoading(true);

      const fData = new FormData();
      fData.append(
        "product",
        new Blob([JSON.stringify(payload)], {
          type: "application/json",
        }),
      );

      fData.append("image", file);

      const res = await fetch("http://localhost:8080/api/vendor/add-product", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: fData,
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
        fileRef.current.value = "";

        navigate("/vendor/products");
      } else {
        toast.error(result.message || "Error occurred");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-slate-50 p-5">
      {/* HEADER */}
      <div className="flex justify-between mb-8">
        <div className="flex items-center gap-3">
          <FiPackage className="text-blue-500 text-4xl" />
          <div>
            <h1 className="text-2xl font-bold">Add Product</h1>
            <p className="text-sm text-gray-500">Create marketplace product</p>
          </div>
        </div>

        <button
          onClick={() => navigate("/vendor/products")}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Back
        </button>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl">
        {/* PRODUCT NAME */}
        <input
          name="productName"
          value={formData.productName}
          onChange={handleChange}
          placeholder="Product name"
          className="border p-2 w-full mb-2"
        />
        <p className="text-red-500 text-sm">{errors.productName}</p>

        {/* DESCRIPTION */}
        <textarea
          name="productDescription"
          value={formData.productDescription}
          onChange={handleChange}
          placeholder="Description"
          className="border p-2 w-full mb-2"
        />
        <p className="text-red-500 text-sm">{errors.productDescription}</p>

        {/* CATEGORY + DISTRICT */}
        <div className="grid grid-cols-2 gap-4">
          <select
            name="categoryId"
            onChange={handleChange}
            className="border p-2"
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.categoryName}
              </option>
            ))}
          </select>

          <select
            name="districtId"
            onChange={handleChange}
            className="border p-2"
          >
            <option value="">Select District</option>
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.districtName}
              </option>
            ))}
          </select>
        </div>

        <p className="text-red-500 text-sm">{errors.categoryId}</p>
        <p className="text-red-500 text-sm">{errors.districtId}</p>

        {/* TOGGLE */}
        <div className="flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            checked={formData.hasVariants}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                hasVariants: e.target.checked,
                variants: e.target.checked
                  ? [{ size: "", color: "", price: "", stock: "" }]
                  : [],
              }))
            }
          />
          <label>Product has variants</label>
        </div>

        {/* SINGLE PRODUCT MODE */}
        {!formData.hasVariants && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price"
                className="border p-2 w-full"
              />
              <p className="text-red-500 text-sm">{errors.price}</p>
            </div>

            <div>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Stock"
                className="border p-2 w-full"
              />
              <p className="text-red-500 text-sm">{errors.stock}</p>
            </div>
          </div>
        )}

        {/* VARIANT MODE */}
        {formData.hasVariants && (
          <div className="mt-5 border p-4 rounded-xl">
            <div className="flex justify-between mb-3">
              <h2 className="font-bold">Variants</h2>

              <button
                type="button"
                onClick={handleAddVariant}
                className="text-blue-500"
              >
                + Add Variant
              </button>
            </div>

            {formData.variants.map((v, i) => (
              <div key={i} className="grid grid-cols-4 gap-2 mb-2">
                <input
                  name="size"
                  value={v.size}
                  onChange={(e) => handleVariantChange(i, e)}
                  placeholder="Size"
                  className="border p-2"
                />

                <input
                  name="color"
                  value={v.color}
                  onChange={(e) => handleVariantChange(i, e)}
                  placeholder="Color"
                  className="border p-2"
                />

                <input
                  name="price"
                  type="number"
                  value={v.price}
                  onChange={(e) => handleVariantChange(i, e)}
                  placeholder="Price"
                  className="border p-2"
                />

                <input
                  name="stock"
                  type="number"
                  value={v.stock}
                  onChange={(e) => handleVariantChange(i, e)}
                  placeholder="Stock"
                  className="border p-2"
                />

                <button
                  type="button"
                  onClick={() => handleDelete(i)}
                  className="text-red-500 col-span-4 text-left"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        {/* IMAGE */}
        <input
          type="file"
          ref={fileRef}
          onChange={(e) => setFile(e.target.files[0])}
        />
        <p className="text-red-500 text-sm">{errors.file}</p>

        {/* SUBMIT */}
        <button
          disabled={loading}
          className="bg-blue-500 text-white w-full p-2 mt-4 rounded-lg"
        >
          {loading ? "Saving..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default VendorProductForm;
