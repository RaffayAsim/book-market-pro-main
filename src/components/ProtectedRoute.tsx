import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuthor?: boolean;
}

const ProtectedRoute = ({ children, requireAuthor = false }: ProtectedRouteProps) => {
  const { user, loading, isAuthor } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && user && requireAuthor && !isAuthor) {
      toast({
        title: "Author Access Required",
        description: "Become an author to access this page. Update your profile to get started.",
        variant: "destructive",
      });
    }
  }, [loading, user, isAuthor, requireAuthor, toast]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  if (requireAuthor && !isAuthor) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;