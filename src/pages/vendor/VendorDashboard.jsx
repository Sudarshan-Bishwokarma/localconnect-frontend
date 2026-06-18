import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

// PIE DATA
const pieData = [
  { name: "Delivered", value: 60 },
  { name: "Pending", value: 25 },
  { name: "Cancelled", value: 15 },
  { name: "Processing", value: 20 },
];

const COLORS = ["#22c55e", "#facc15", "#ef4444", "#3b82f6"];

// BAR DATA
const barData = [
  { month: "Jan", orders: 40 },
  { month: "Feb", orders: 60 },
  { month: "Mar", orders: 30 },
  { month: "Apr", orders: 80 },
  { month: "May", orders: 50 },
];

const VendorDashboard = () => {
  return (
    <div className="p-6 bg-gray-100 ">
      {/* TITLE */}
      <h1 className="text-3xl font-bold text-center mb-10">Admin Dashboard</h1>

      {/* KPI CARDS */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <p className="text-gray-500">Users</p>
          <p className="text-2xl font-bold">120</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <p className="text-gray-500">Vendors</p>
          <p className="text-2xl font-bold">100</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <p className="text-gray-500">Products</p>
          <p className="text-2xl font-bold">120</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <p className="text-gray-500">Orders</p>
          <p className="text-2xl font-bold">120</p>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-2 gap-8">
        {/* PIE CHART */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-6">Order Status</h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>

              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* BAR CHART */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-6">Orders Overview</h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />
              <YAxis />

              <Tooltip />

              <Bar dataKey="orders" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
