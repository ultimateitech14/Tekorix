import type {
  ChangePasswordValues,
  ForgotPasswordValues,
  LoginValues,
  ResetPasswordValues,
} from "@/lib/validators/auth";
import { clearAuthToken, setAuthToken } from "@/lib/auth/store";
import { requestApi } from "@/lib/api/http";

type ApiResult = {
  success: boolean;
  message: string;
};

type LoginResponse = {
  token: string;
  admin: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
};

export async function loginAdmin(body: LoginValues): Promise<ApiResult> {
  const result = await requestApi<LoginResponse, LoginValues>("/api/auth/admin/login", {
    method: "POST",
    body,
  });

  setAuthToken(result.data.token);

  return {
    success: true,
    message: result.message,
  };
}

export async function forgotPassword(body: ForgotPasswordValues): Promise<ApiResult> {
  const result = await requestApi<null, ForgotPasswordValues>("/api/auth/admin/forgot-password", {
    method: "POST",
    body,
  });

  return {
    success: true,
    message: result.message,
  };
}

export async function resetPassword(body: ResetPasswordValues): Promise<ApiResult> {
  const result = await requestApi<null, ResetPasswordValues>("/api/auth/admin/reset-password", {
    method: "POST",
    body,
  });

  return {
    success: true,
    message: result.message,
  };
}

export async function changePassword(body: ChangePasswordValues): Promise<ApiResult> {
  const result = await requestApi<null, ChangePasswordValues>("/api/auth/admin/change-password", {
    method: "POST",
    body,
    auth: true,
  });

  return {
    success: true,
    message: result.message,
  };
}

export async function logoutAdmin(): Promise<ApiResult> {
  clearAuthToken();

  return {
    success: true,
    message: "Signed out successfully.",
  };
}

export async function getAdminMe() {
  const result = await requestApi<{ id: string; name: string; email: string; role: string }>(
    "/api/admin/me",
    {
      auth: true,
    },
  );

  return result.data;
}
