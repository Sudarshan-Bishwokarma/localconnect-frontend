const ProductRow = ({ product }) => {
  return (
    <tr className="border-t hover:bg-slate-50 transition ">
      <td className="p-3">
        <div className="flex items-center gap-3">
          <div className="h-16 w-16 flex-shrink-0 border border-gray-200 overflow-hidden">
            <img
              src={`data:image/jpeg;base64,${product.productImageBase64}`}
              alt="image"
              className="w-full  h-full object-cover rounded"
            />
          </div>
          <p className="font-medium">{product.productName}</p>
        </div>
      </td>
      <td className="p-3"> {product.districtName}</td>
      <td className="p-3">{product.productCategory}</td>
      <td className="p-3"> RS. {product.productPrice}</td>
      <td className="p-3">
        <div className=" flex gap-5  flex-wrap">
          <button className=" border border-gray-300 text-gray-700 rounded-lg py-2 px-3 cursor-pointer  hover:bg-gray-100 transition">
            View
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition">
            Edit
          </button>
          <button className="bg-red-500 text-white px-3 py-2  rounded-lg cursor-pointer hover:bg-red-600">
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};
export default ProductRow;
