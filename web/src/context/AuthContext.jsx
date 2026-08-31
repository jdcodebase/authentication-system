import { createContext, useContext, useState, useEffect, useRef } from "react";

import { refreshAccessToken, logoutUser } from "../services/auth.service";
import {
  registerAccessTokenGetter,
  registerAuthFailureHandler,
} from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const accessTokenRef = useRef(null);
  accessTokenRef.current = accessToken;

  useEffect(() => {
    registerAccessTokenGetter(() => accessTokenRef.current);

    registerAuthFailureHandler((event) => {
      if (event.type === "refreshed") {
        setAccessToken(event.accessToken);
        if (event.user) setUser(event.user);
      } else if (event.type === "logout") {
        setUser(null);
        setAccessToken(null);
      }
    });
  }, []);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { data } = await refreshAccessToken();
        setUser(data.data.user);
        setAccessToken(data.data.accessToken);
      } catch (error) {
        setUser(null);
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const setAuth = ({ user: newUser, accessToken: newAccessToken }) => {
    setUser(newUser);
    setAccessToken(newAccessToken);
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      // ignore
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
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
