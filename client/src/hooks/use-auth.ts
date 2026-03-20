import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const loginMutation = useMutation({
    mutationFn: (data: any) => authApi.login(data),
    onSuccess: (data) => {
      // Assuming data matches LoginResponseDto { accessToken, refreshToken, user }
      // You might need to update your API controller to return user info or do a separate fetch
      setAuth(data.user || {}, data.accessToken, data.refreshToken);
      router.push("/");
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: any) => authApi.register(data),
    onSuccess: () => {
      router.push("/verify-email");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: (email: string) => authApi.logout(email),
    onSuccess: () => {
      clearAuth();
      router.push("/login");
    },
  });

  return {
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    logout: logoutMutation.mutate,
  };
};
