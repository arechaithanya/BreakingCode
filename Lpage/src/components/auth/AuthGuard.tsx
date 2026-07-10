import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  requireVerified?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, requireVerified = true }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Redirect to login with the current path to return back after login
        navigate('/login', { state: { from: location.pathname }, replace: true });
      } else if (requireVerified && !user.email_confirmed_at && user.id !== 'demo-user-id') {
        // Redirect to verify email if not verified
        navigate('/verify-email', { replace: true });
      }
    }
  }, [user, loading, navigate, location, requireVerified]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#00ff88]/20 border-t-[#00ff88] rounded-full animate-spin" />
          <p className="text-[#00ff88] font-mono animate-pulse text-sm">INITIALIZING AUTH...</p>
        </div>
      </div>
    );
  }

  if (!user || (requireVerified && !user.email_confirmed_at && user.id !== 'demo-user-id')) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
