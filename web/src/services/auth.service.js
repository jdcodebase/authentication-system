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

export const getDevices = () => api.get("/users/devices");

export const revokeDevice = (sessionId) =>
  api.delete(`/users/devices/${sessionId}`);

export const sendForgotPasswordOtp = (data) =>
  api.post("/auth/forgot-password/send-otp", data);

export const verifyForgotPasswordOtp = (data) =>
  api.post("/auth/forgot-password/verify-otp", data);

export const resetPassword = (data, passwordResetToken) =>
  api.post("/auth/forgot-password/reset-password", data, {
    headers: {
      Authorization: `Bearer ${passwordResetToken}`,
    },
  });
