import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { TopLoader } from './TopLoader';

export function ProtectedRoute({ adminOnly = true }) {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, checkAuth } = useAuthStore();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      await checkAuth();
      setIsCheckingAuth(false);
    };
    verifyAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isCheckingAuth) {
      if (!isAuthenticated) {
        navigate('/login', { replace: true });
      } else if (adminOnly && !isAdmin) {
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, isAdmin, isCheckingAuth, navigate, adminOnly]);

  if (isCheckingAuth) {
    return <TopLoader />;
  }

  if (!isAuthenticated || (adminOnly && !isAdmin)) {
    return null;
  }

  return <Outlet />;
}
