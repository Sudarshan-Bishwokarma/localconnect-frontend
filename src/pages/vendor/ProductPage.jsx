import { useEffect, useState } from "react";
import ProductTable from "../../components/Vendor/ProductTable";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

const ProductPage = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [districts, setDistricts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedDistrict = searchParams.get("districtId") || "";
  const selectedCategory = searchParams.get("categoryId") || "";
  const sortBy = searchParams.get("sortType") || "";

  const [products, setProduct] = useState([]);

  useEffect(() => {
    fetchDistricts();
    fetchCategories();
  }, []);
  useEffect(() => {
    fetchProducts();
  }, [searchParams]);
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
  //  fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams();
      //distict
      if (selectedDistrict) {
        params.append("districtId", selectedDistrict);
      }
      if (selectedCategory) {
        params.append("categoryId", selectedCategory);
      }
      if (sortBy) {
        params.append("sortType", sortBy);
      }

      const response = await fetch(
        `http://localhost:8080/api/vendor/products?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status === 401) {
        localStorage.removeItem("token");
        toast.error("Session Expired.Please Login First");
        navigate("/login");
        return;
      }
      const result = await response.json();
      if (response.ok) {
        setProduct(result.data.content);
      } else {
        toast.error("Failed to fetch the Products");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const updateParams = (key, value) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }

      return params;
    });
  };
  return (
    <div className=" p-8  bg-slate-50 min-h-full">
      <div className="flex items-center justify-between ">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">
            Product Management
          </h1>
          <p className="text-2xl  mt-2 text-gray-500 leading-relaxed ">
            Manage your Products
          </p>
        </div>
        <button
          className="bg-blue-500 rounded-xl cursor-pointer hover:bg-blue-600  hover:scale-[1.02] text-white font-semibold  p-3 rounded-xl flex-wrap disabled:bg-gray-400  transition-all   "
          onClick={() => navigate("/vendor/add-product")}
        >
          + Add Product
        </button>
      </div>
      {/*filter by districts */}
      <div className=" flex bg-white rounded-2xl justify-between px-8 py-5 mt-6 shadow">
        <select
          value={selectedDistrict}
          onChange={(e) => {
            const value = e.target.value;
            updateParams("districtId", value);
          }}
          className=" border border-gray-300 bg-white rounded-xl px-4 py-3 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Districts</option>
          {districts.map((district) => (
            <option key={district.id} value={district.id}>
              {district.districtName}
            </option>
          ))}
        </select>
        {/* filter by categories*/}
        <select
          value={selectedCategory}
          onChange={(e) => {
            const value = e.target.value;
            updateParams("categoryId", value);
          }}
          className=" border border-gray-300 rounded-lg px-4 py-3 shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.categoryName}
            </option>
          ))}
        </select>
        {/*sort products */}
        <select
          value={sortBy}
          onChange={(e) => {
            const value = e.target.value;
            updateParams("sortType", value);
          }}
          className="border border-gray-300 rounded-lg px-4 py-3 shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Sort</option>
          <option value="priceAsc">Price:Low TO High</option>
          <option value="priceDesc">Price:High TO Low</option>
          <option value="nameAsc">Name: A-Z</option>
          <option value="nameDesc">Name: Z To A</option>
        </select>
      </div>
      {/*loading*/}
      {loading && (
        <div className="text-center text-center">Loading Products......</div>
      )}
      {/* error */}
      {error && <div className="text-center text-xl mt-7px">{error}</div>}
      {!loading && !error && (
        <div>
          <ProductTable
            products={products}
            emptyMessage={
              role === "ROLE_VENDOR"
                ? "No Produt Avaliabe. Please  add a  new  product..."
                : "No Product Avaliable"
            }
          />
        </div>
      )}
    </div>
  );
};
export default ProductPage;
