import API from "./api";

export const registerUser = (userData) => {
  return API.post("/register", userData);
};

export const loginUser = (userData) => {
  return API.post("/login", userData);
};

export const logoutUser = () => {
  return API.post("/logout");
};

export const getProfile = () => {
  return API.get("/profile");
};

export const refreshToken = () => {
  return API.post("/refresh-token");
};
