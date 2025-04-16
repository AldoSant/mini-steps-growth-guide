
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const ProtectedRoute = () => {
  const { user, loading, userRole, userProfile, isProfileLoading } = useAuth();
  const location = useLocation();
  
  // Check if the route is professional-only
  const isProfessionalOnlyRoute = location.pathname === "/criar-conteudo";
  
  if (loading || isProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-marcos-purple">Carregando...</div>
      </div>
    );
  }
  
  // If not logged in, redirect to auth
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  // If trying to access professional-only routes without being a professional or admin
  if (isProfessionalOnlyRoute && userRole !== 'professional' && userRole !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute;
