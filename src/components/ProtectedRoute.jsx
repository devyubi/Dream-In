import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>로딩 중...</p>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
