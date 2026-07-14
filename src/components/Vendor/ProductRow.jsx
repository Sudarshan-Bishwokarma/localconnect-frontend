import { Link, useNavigate } from "react-router-dom";
const ProductRow = ({ product }) => {
  const hasVariants = product.hasVariants;
  const navigate = useNavigate();
  const id = product.productId;
  return (
    <tr className="border-t hover:bg-slate-50 transition-all ">
      <td className="p-3">
        <div className="flex items-center gap-3">
          {/* product image */}
          <div className="h-20 w-20 flex-shrink-0 border border-gray-200 overflow-hidden">
            <img
              src={`data:image/jpeg;base64,${product.productImageBase64}`}
              alt="image"
              className="w-full  h-full object-cover rounded"
            />
          </div>
          <div className="">
            <p className="font-semibold text-gray-800">{product.productName}</p>
            {hasVariants ? (
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                Has Variants
              </span>
            ) : (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                Single Product
              </span>
            )}
          </div>
        </div>
      </td>
      <td className="p-3">{product.productCategory}</td>
      {/*  product price */}
      <td className="p-3">
        {hasVariants ? (
          <div>
            <p className="font-semibold">From Rs.{product.productPrice}</p>
            <p className="text-xs text-gray-500">Lowest Variant Price</p>
          </div>
        ) : (
          <p className="font-semibold"> Rs. {product.productPrice}</p>
        )}
      </td>
      {/*  price stocks */}
      <td className="p-3 ">
        {" "}
        {hasVariants ? (
          <div>
            {" "}
            <p>{product.stock}</p>
            <p className="text-xs text-gray-500">Total Stock</p>
          </div>
        ) : (
          <p className="font-medium text-gray-800">{product.stock}</p>
        )}
      </td>
      {/* status*/}
      <td className="p-3">
        {product.status === "ACTIVE" && (
          <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs">
            ACTIVE
          </span>
        )}

        {product.status === "DRAFT" && (
          <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded text-xs">
            DRAFT
          </span>
        )}

        {product.status === "INACTIVE" && (
          <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs">
            INACTIVE
          </span>
        )}

        {product.status === "OUT_OF_STOCK" && (
          <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs">
            OUT OF STOCK
          </span>
        )}
      </td>
      {/*  actions */}
      <td className="">
        <div className=" flex gap-5 items-center  flex-wrap">
          <Link to={`/vendor/product/${product.productId}`}>
            <button className=" border border-gray-300 text-gray-700 rounded-lg py-2 px-3 cursor-pointer  hover:bg-gray-100 transition">
              View
            </button>
          </Link>
          <button
            onClick={() => navigate(`/vendor/product/edit/${id}`)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition"
          >
            Edit
          </button>
          <button
            onClick={() => navigate("/")}
            className="bg-red-500 text-white px-3 py-2  rounded-lg cursor-pointer hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};
export default ProductRow;
