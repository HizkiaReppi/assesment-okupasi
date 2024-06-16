import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface RedirectRouteProps {
  element: React.ReactElement;
}

const RedirectRoute: React.FC<RedirectRouteProps> = ({ element }) => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? <Navigate to="/home" replace /> : element;
};

export default RedirectRoute;
