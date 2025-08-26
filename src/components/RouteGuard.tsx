import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getRedirectPath } from '@/utils/routeGuards';

interface RouteGuardProps {
  children: ReactNode;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const redirectPath = getRedirectPath(location.pathname);
    if (redirectPath) {
      navigate(redirectPath, { replace: true });
    }
  }, [location.pathname, navigate]);
  
  return <>{children}</>;
};