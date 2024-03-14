"use client";

export const setAuthToken = (token: string | undefined) => {
  if (token?.trim()) {
    localStorage.setItem("authToken", token);
  } else {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
  }
  return token;
};

export const getAuthToken = () => {
  return localStorage.getItem("authToken") ?? "";
};
