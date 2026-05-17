import ProductRow from "./ProductRow";
const ProductTable = ({ products }) => {
  return (
    <div className="bg-white  rounded-2xl mt-6 overflow-x-auto shadow-sm border border-gray-200">
      <table className="w-full min-w-[800px]">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr className="text-left text-sm uppercase tracking-wide text-gray-600">
            <th className="px-6 py-4">Products</th>
            <th className="px-6 py-4">District</th>
            <th className="x-6 py-3">Category</th>
            <th className="px-6 py-3">Price</th>
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <ProductRow key={product.productId} product={product} />
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-10 text-gray-500">
                No Products Available. Add a new product to get Started.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
export default ProductTable;
