import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const userRole = localStorage.getItem("userRole");

  // Idan babu kowa (ba a yi login ba)
  if (!userRole) {
    return <Navigate to="/" replace />;
  }

  // Idan role dinsa ba ya cikin jerin wadanda aka yarda su gani
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;