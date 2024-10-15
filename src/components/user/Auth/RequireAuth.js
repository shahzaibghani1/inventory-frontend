import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const location = useLocation();
  const storedAuth = JSON.parse(localStorage.getItem('userData'));
  const isAuthorized = storedAuth && allowedRoles.includes(storedAuth.role);

  if (!isAuthorized) {
    if (!storedAuth || !storedAuth.emails) {
      return <Navigate to="/" state={{ from: location }} replace />;
    } else {
      return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }
  }

  return <Outlet />;
};

export default RequireAuth;
