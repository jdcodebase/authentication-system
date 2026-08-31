import { createContext, useContext, useState, useEffect } from "react";

import { refreshAccessToken, logoutUser } from "../services/auth.service";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true); // true until initial refresh check completes

  // On app load: try to silently restore a session via the httpOnly refresh cookie.
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { data } = await refreshAccessToken();
        setUser(data.data.user);
        setAccessToken(data.data.accessToken);
      } catch (error) {
        // No valid session — that's fine, just means the user isn't logged in.
        setUser(null);
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  // Called by Login/Register pages after their own API call succeeds.
  const setAuth = ({ user: newUser, accessToken: newAccessToken }) => {
    setUser(newUser);
    setAccessToken(newAccessToken);
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      // Even if the API call fails, clear local state — user should
      // always be able to "log out" from the frontend's perspective.
    } finally {
      setUser(null);
      setAccessToken(null);
    }
  };

  const value = {
    user,
    accessToken,
    isAuthenticated: !!user,
    loading,
    setAuth,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
