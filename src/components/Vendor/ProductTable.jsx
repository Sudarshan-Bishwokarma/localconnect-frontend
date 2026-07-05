import ProductRow from "./ProductRow";
const ProductTable = ({ products, emptyMessage }) => {
  return (
    <div className="bg-white  rounded-2xl mt-6 overflow-x-auto shadow-sm border border-gray-200">
      <table className="w-full min-w-[800px]">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr className="text-left text-sm uppercase tracking-wide text-gray-600">
            <th className="p-4">Products</th>
            <th className="p-4">Category</th>
            <th className="p-4">Product Price</th>
            <th className="p-4">Stocks</th>
            <th className="p-4">Status</th>
            <th className="p-4 ">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <ProductRow key={product.productId} product={product} />
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-gray-500 text-center px-2 py-5 ">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
export default ProductTable;
