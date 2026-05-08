import { Navigate } from "react-router-dom";
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    <Navigate to="/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(role)) {
    <Navigate to="/unauthorized" replace />;
  }
  return children;
};

export default ProtectedRoute;
// props = object that contains all data passed to a component
