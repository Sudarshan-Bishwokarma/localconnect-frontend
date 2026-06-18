import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const OAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  useEffect(() => {
    const token = searchParams.get("token");
    const role = searchParams.get("role");
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      navigate(role === "ROLE_ADMIN" ? "/admin" : "/home");
    }
  });
  return (
    <div>
      <p>Logging you in with Google....</p>
    </div>
  );
};
export default OAuthSuccess;
