import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    toast.error("Please login First!");

    return <Navigate to="/auth/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(role)) {
    toast.error("Access denied");
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
};

export default ProtectedRoute;
// props = object that contains all data passed to a component
