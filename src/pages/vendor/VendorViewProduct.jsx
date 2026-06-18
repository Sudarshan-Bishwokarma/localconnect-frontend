import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const VendorViewProduct = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [productDetails, setProductDetails] = useState({});
  useEffect(() => {
    fetchProductDetails(id);
  }, []);

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
        setProductDetails(result.data.content);
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
    }
  };
  if (loading) {
    return <h1 className="text-center text-gray-500 mt-5">Loading......</h1>;
  }
  return (
    <div>
      <h1>Product Details </h1>
    </div>
  );
};
export default VendorViewProduct;
