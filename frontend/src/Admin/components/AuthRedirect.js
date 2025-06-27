// src/components/AuthRedirect.js
import { Navigate } from 'react-router-dom';

const AuthRedirect = ({ children }) => {
  const token = localStorage.getItem('crm_token');
  return token ? <Navigate to="" /> : children;
};

export default AuthRedirect;
