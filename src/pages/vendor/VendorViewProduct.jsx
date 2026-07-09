import { Key } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaBox, FaMapMarkerAlt, FaRupeeSign, FaTag } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

const VendorViewProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [productDetails, setProductDetails] = useState({});
  const [selectedVariant, setSelectedVariant] = useState(null);
  useEffect(() => {
    fetchProductDetails(id);
  }, [id]);
  // auto select first variant
  useEffect(() => {
    if (productDetails?.variantsDetails?.length > 0) {
      setSelectedVariant(productDetails.variantsDetails[0]);
    }
  }, [productDetails]);
  // handle change status
  const changeStatus = async () => {
    const productId = productDetails?.productId;
    const newStatus =
      productDetails?.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8080/api/vendor/${productId}/update-status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        },
      );
      const result = await response.json();
      if (response.ok) {
        toast.success(result.message);
        setProductDetails((prev) => ({
          ...prev,
          status: newStatus,
        }));
      } else {
        const errorMsg = result?.data?.code;
        if (errorMsg === "PRODUCT_NOT_FOUND") {
          toast.error("Product Not Found");
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  // fetch   product details
  const fetchProductDetails = async (productId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8080/api/product/${productId}`,
      );
      let result;
      try {
        result = await response.json();
      } catch {
        message: "Something went wrong";
      }
      if (response.ok) {
        setProductDetails(result.data);
      } else {
        const errroMsg = result?.data?.code;
        if (errroMsg == "PRODUCT_NOT_FOUND") {
          toast.error("Product Not Found");
        } else {
          toast.error("Something went wrong");
          console.log(result);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <h1 className="text-center text-xl text-gray-500 mt-15">Loading......</h1>
    );
  }
  return (
    <div>
      {/* top bar */}
      <div className="flex justify-between items-center ">
        {/* LEFT */}
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 hover:text-black font-medium"
        >
          ← Back to products
        </button>

        {/* right   actions buttons */}
        <div className="flex gap-3">
          <button className=" px-4 py-2 rounded-lg text-gray-700   border border-gray-200 cursor-pointer hover:bg-gray-100 hover:scale-[1.02] transition">
            Edit Product
          </button>

          <button
            onClick={changeStatus}
            className="bg-red-500 text-white px-3 py-2  rounded-lg cursor-pointer hover:scale-[1.02] hover:bg-red-600 transition"
          >
            {productDetails?.status === "ACTIVE" ? "Deactivate" : "Activate"}
          </button>
        </div>
      </div>
      {/* product information section */}
      <div className=" mt-2 bg-white rounded-2xl  border border-gray-100 shadow-sm p-6 flex flex-col  lg:flex-row gap-8">
        {/* left-side -image*/}
        <div className="w-full lg:w-1/3">
          <div className=" flex justify-center items-center bg-gray-50 rounded-2xl p-4 shadow-sm">
            {productDetails?.productImageBase64 && (
              <img
                src={`data:image/jpeg;base64,${productDetails.productImageBase64}`}
                className="w-full h-96 rounded-xl object-cover hover:scale-105 transition"
                alt="product"
              />
            )}
          </div>
        </div>
        {/* right side details */}
        <div className=" lg:w-2/3 space-y-5 ">
          {/*  name and badge */}
          <div className="flex flex-col items-center  gap-3  mt-3">
            <h1 className="text-3xl font-bold text-gray-800">
              {productDetails.productName}
            </h1>
            {productDetails?.hasVariants ? (
              <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-medium">
                Has Variants
              </span>
            ) : (
              <span className="bg-gray-100  rounded shadow-sm text-gray-600 px-3 py-1 rounded text-sm">
                Single Product
              </span>
            )}
          </div>
          {/*  prduct information */}
          <p className="text-gray-600 mt-5 leading-relaxed">
            {productDetails?.productDescription}
          </p>
          {/* info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2  gap-6 mt-6">
            <div className="flex border border-gray-200 rounded-xl p-3  gap-3 items-center">
              <FaTag className=" text-gray-500 text-lg" />
              <div className="">
                <p className="text-gray-500 text-sm">Category</p>
                <p className="font-semibold text-gray-800">
                  {productDetails?.categoryName}
                </p>
              </div>
            </div>
            <div className="flex  border border-gray-200 rounded-xl items-center gap-3 p-3">
              <FaMapMarkerAlt className=" text-gray-500 text-lg" />
              <div className="">
                <p className="text-gray-500 text-sm">District</p>
                <p className="font-semibold">{productDetails?.districtName}</p>
              </div>
            </div>
            <div className="flex items-center border border-gray-200  rounded-xl p-3 gap-3">
              <FaRupeeSign className="text-gray-500 text-lg" />
              <div>
                <p className="text-gray-500 text-sm">
                  {" "}
                  {productDetails.hasVariants ? " Min Price" : "Price"}
                </p>
                <p className="font-semibold text-green-600">
                  Rs. {productDetails?.productPrice}
                </p>
              </div>
            </div>

            <div className="flex gap-3 border border-gray-200 rounded-xl  items-center p-3">
              <FaBox className="text-gray-400 text-lg" />
              <div>
                <p className="text-gray-500 text-sm">Stocks(Total)</p>
                <p className="font-semibold text-gray-800 ">
                  {productDetails?.stock} Units
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* variant section */}
      {productDetails.hasVariants && (
        <div className="mt-3 bg-white border border-gray-100 shadow-sm rounded-2xl p-6 ">
          <h1 className="font-bold text-gray-800">Available Variants</h1>
          <p className="text-gray-500 leading-relaxed mt-1">
            Select variant to view details
          </p>
          {/* variant  buttons  */}
          <div className="flex flex-wrap  gap-5  mt-3">
            {productDetails?.variantsDetails?.map((variant, index) => (
              <button
                key={variant.id}
                onClick={() => setSelectedVariant(variant)}
                className={`border  px-4 py-2  rounded-lg cursor-pointer hover:scale-[1.02] ${selectedVariant?.id === variant?.id ? "bg-blue-600 text-white border-blue-600 shadow-md" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"}`}
              >
                {variant.size}/ {variant.color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* selected variant details */}
      {selectedVariant && (
        <div className="mt-6 bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-5">
            Selected Variant Details
          </h2>

          <div className="flex flex-col md:flex-row gap-15 items-center">
            {/* Image */}
            <div className=" bg-gray-50 rounded-xl p-2 flex justify-center">
              <img
                src={`data:image/jpeg;base64,${selectedVariant.variantImageBase64}`}
                alt="variant"
                className=" h-64 object-cover rounded-lg"
              />
            </div>

            {/* Details */}
            <div className="w-full md:w-2/3">
              <h2 className="text-2xl font-bold text-gray-800 mb-5">
                {selectedVariant.size} / {selectedVariant.color}
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-xl p-4 hover:scale-[1.02] transition">
                  <p className="text-gray-500 text-sm">Size</p>

                  <p className="font-semibold">{selectedVariant.size}</p>
                </div>

                <div className="border rounded-xl p-4 hover:scale-[1.02] transition">
                  <p className="text-gray-500 text-sm">Color</p>

                  <p className="font-semibold">{selectedVariant.color}</p>
                </div>

                <div className="border rounded-xl p-4 hover:scale-[1.02] transition">
                  <p className="text-gray-500 text-sm">Price</p>

                  <p className="font-semibold text-green-600">
                    Rs. {selectedVariant.price}
                  </p>
                </div>

                <div className="border rounded-xl p-4 hover:scale-[1.02] transition">
                  <p className="text-gray-500 text-sm">Stock</p>

                  <p className="font-semibold">{selectedVariant.stock} Units</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default VendorViewProduct;
