import axiosClient from "./axios-client";

interface LoginRequest {
  email: string;
}

export const authApi = {
  login: async (data: any) => {
    const response = await axiosClient.post("/auth/login", data);
    return response.data;
  },
  register: async (data: any) => {
    const response = await axiosClient.post("/auth/register", data);
    return response.data;
  },
  verifyEmail: async (data: { email: string; code: string }) => {
    const response = await axiosClient.post("/auth/verify-email", data);
    return response.data;
  },
  logout: async (email: string) => {
    const response = await axiosClient.post("/auth/logout", { email });
    return response.data;
  },
};
