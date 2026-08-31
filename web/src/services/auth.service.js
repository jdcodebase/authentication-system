import api from "./api";

export const sendRegistrationOtp = (data) =>
  api.post("/auth/register/send-otp", data);

export const verifyRegistrationOtp = (data) =>
  api.post("/auth/register/verify-otp", data);

export const completeRegistration = (data, registrationToken) =>
  api.post("/auth/register/complete", data, {
    headers: { Authorization: `Bearer ${registrationToken}` },
  });

export const loginUser = (data) => api.post("/auth/login", data);

export const refreshAccessToken = () => api.post("/auth/refresh-token");

export const logoutUser = () => api.post("/auth/logout");
