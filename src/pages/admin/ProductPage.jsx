import { useEffect, useState } from "react";
import ProductTable from "../../components/admin/ProductTable";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ProductPage = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [products, setProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [districts, setDistricts] = useState([]);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [navigate, token]);
  useEffect(() => {
    if (token) {
      fetchDistricts();
      fetchCategories();
      fetchProducts();
    }
  }, [token]);

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
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("http://localhost:8080/api/all-products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 401) {
        localStorage.removeItem("token");
        toast.error("Session Expired. Pleasae Login First");
        navigate("/login");
        return;
      }
      const result = await response.json();
      if (response.ok) {
        setProduct(result.data);
      } else {
        toast.error(result.message || "Failed to Fetch Products");
      }
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className=" p-8  bg-slate-50 min-h-full">
      <div className="flex items-center justify-between ">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">
            Product Management
          </h1>
          <p className="text-2xl  mt-2 text-gray-500">Manage your Products</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-xl">
          + Add Product
        </button>
      </div>
      {/*filter districts */}
      <div className=" flex bg-white rounded-2xl justify-between px-8 py-5 mt-6 shadow">
        <select className=" border border-gray-300 bg-white rounded-xl px-4 py-3 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Districts</option>
          {districts.map((district) => (
            <option key={district.id} value={district.id}>
              {district.districtName}
            </option>
          ))}
        </select>
        {/* filter categories*/}
        <select className=" border border-gray-300 rounded-lg px-4 py-3 shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Categories</option>
          {categories.map((category) => (
            <option key={category.category_id} value={category.category_id}>
              {category.categoryName}
            </option>
          ))}
        </select>
        <select className="border border-gray-300 rounded-lg px-4 py-3 shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Sort</option>
        </select>
      </div>
      {/*loading*/}
      {loading && (
        <div className="text-center text">Loading Products......</div>
      )}
      {/* error */}
      {error && <div className="text-center text-xl mt-7px">{error}</div>}
      {!loading && !error && (
        <div>
          <ProductTable products={products} />
        </div>
      )}
    </div>
  );
};
export default ProductPage;
