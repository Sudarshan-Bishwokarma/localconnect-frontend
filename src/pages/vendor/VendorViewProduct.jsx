import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaBox, FaMapMarkerAlt, FaRupeeSign, FaTag } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

const VendorViewProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [productDetails, setProductDetails] = useState({});
  useEffect(() => {
    fetchProductDetails(id);
  }, [id]);

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
        console.log("BASE64:", productDetails?.productImageBase64);
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
          className="text-gray-600 hover:text-black"
        >
          ← Back
        </button>

        {/* right   actions buttons */}
        <div className="flex gap-3">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg  cursor-pointer hover:bg-blue-600 hover:scale-[1.02]">
            Edit Product
          </button>

          <button className="bg-red-500 text-white px-3 py-2  rounded-lg cursor-pointer hover:scale-[1.02] hover:bg-red-600">
            Deactivate
          </button>
        </div>
      </div>
      {/* product information section */}
      <div className="bg-white rounded-xl shadow-sm p-6 flex gap-8">
        {/* left-side -image*/}
        <div className="w-1/3 ">
          <img
            src={`data:image/jpeg;base64,${productDetails?.productImageBase64}`}
            className="w-full h-72 rounded-xl object-cover"
            alt="product"
          />
        </div>
        {/* right side details */}
        <div className="w-2/3  ">
          {/*  name and badge */}
          <div className="flex items-center justify-between mt-3">
            <h1 className="text-2xl font-bold">{productDetails.productName}</h1>
            {productDetails?.hasVariants ? (
              <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded text-sm">
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
          {/* INFO GRID */}
          <div className="grid grid-cols-2 gap-10 mt-6">
            <div className="flex  gap-3">
              <FaTag className=" text-gray-500 text-lg" />
              <div className="">
                <p className="text-gray-500 text-sm">Category</p>
                <p className="font-semibold">{productDetails?.categoryName}</p>
              </div>
            </div>

            <div className="flex  items-start gap-3">
              <FaMapMarkerAlt className=" text-gray-500 text-lg" />
              <div className="">
                <p className="text-gray-500 text-sm">District</p>
                <p className="font-semibold">{productDetails?.districtName}</p>
              </div>
            </div>

            <div className="flex items-start  gap-3">
              <FaRupeeSign className="text-gray-500 text-lg" />
              <div>
                <p className="text-gray-500 text-sm"> Min Price</p>
                <p className="font-semibold text-green-600">
                  Rs. {productDetails?.productPrice}
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <FaBox className="text-gray-400 text-lg" />
              <div>
                <p className="text-gray-500 text-sm">Stocks</p>
                <p className="font-semibold">{productDetails?.stock}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* variant details */}
      {productDetails?.hasVariants && (
        <div className="mt-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-xl font-bold text-gray-800 tracking-wide">
                Available Variants
              </h1>
              <p className="text-sm text-gray-500">
                Size, color and stock details of this product
              </p>
            </div>
          </div>
          <div className="w-full overflow-x-auto bg-white  rounded-lg">
            <table className="w-full  text-sm">
              <thead className="bg-gray-50 border-gray-200 text-left uppercase tracking-wide text-gray-600">
                <tr>
                  <th className="p-3">Size</th>
                  <th className="p-3">Color</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Stock</th>
                </tr>
              </thead>
              <tbody>
                {productDetails?.variantsDetails?.map((v, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-3">{v.size}</td>
                    <td className="p-3">{v.color}</td>
                    <td className="p-3 text-green-600 font-semibold">
                      Rs. {v.price}
                    </td>
                    <td className="p-3">{v.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
export default VendorViewProduct;
