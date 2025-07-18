import { createContext, useContext, useEffect, useState } from "react";
import {
  loginUser,
  signupUser,
  logoutUser,
  getCurrentUser,
  googleSignupInit,
  googleSignupComplete,
  googleLoginUser,
} from "../services/authServices"; // 🔁 Adjust path if needed

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 On mount, fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getCurrentUser();
        setUser(data.user || data); // based on your API response
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // ────── Auth Functions ──────

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    setUser(data.user || data);
    return data;
  };

  const signup = async (formData) => {
    const data = await signupUser(formData);
    setUser(data.user || data);
    return data;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  const googleInit = async (code) => {
    const data = await googleSignupInit(code);
    setUser(data.user || data);
    return data;
  };

  const googleComplete = async (details) => {
    const data = await googleSignupComplete(details);
    setUser(data.user || data);
    return data;
  };

  const googleLogin = async (code) => {
    const data = await googleLoginUser(code);
    setUser(data.user || data);
    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        signup,
        googleInit,
        googleComplete,
        googleLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 🔁 Custom hook
export const useAuth = () => useContext(AuthContext);
