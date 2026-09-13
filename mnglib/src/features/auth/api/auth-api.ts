import { userApi, type User } from "@entities/user";

import {
  ApiError,
  http,
  isMockMode,
  mockDelay,
  tokenStorage,
} from "@shared/api";

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

export type RegisterResponse = {
  user: User;
};

export type AuthErrorCode =
  | "email_taken"
  | "username_taken"
  | "validation_failed"
  | "invalid_body"
  | "internal";

export type AuthApiError = ApiError & { code?: AuthErrorCode };

type ApiErrorResponse = {
  error?: {
    code?: string;
    message?: string;
  };
};

export const authApi = {
  async register(
    email: string,
    username: string,
    password: string
  ): Promise<User> {
    if (isMockMode()) {
      await mockDelay();
      const user = await userApi.getProfile();
      return { ...user, email, username, handle: username.toLowerCase() };
    }

    try {
      const response = await http.post<RegisterResponse>("/auth/register", {
        body: { email, username, password },
      });

      return response.user;
    } catch (error) {
      if (error instanceof ApiError) {
        let code: AuthErrorCode = "internal";
        let message = "Registration failed. Please try again.";

        const payload = error.payload as ApiErrorResponse | undefined;
        code = (payload?.error?.code as AuthErrorCode | undefined) ?? code;
        message =
          payload?.error?.message ??
          getRegistrationStatusError(error.status) ??
          message;

        throw Object.assign(error, { code, message });
      }

      throw error;
    }
  },

  async login(email: string, password: string): Promise<LoginResponse> {
    if (isMockMode()) {
      await mockDelay();
      const user = await userApi.getProfile();
      const response: LoginResponse = { accessToken: "mock-session-token", refreshToken: "", user };
      tokenStorage.set(response.accessToken);
      return response;
    }

    const response = await http.post<LoginResponse>("/auth/login", {
      body: { email, password },
    });
    tokenStorage.set(response.accessToken);
    setRefreshTokenCookie(response.refreshToken);
    return response;
  },

  async logout(): Promise<void> {
    tokenStorage.clear();
    clearRefreshTokenCookie();

    if (!isMockMode()) {
      await http.post<void>("/auth/logout").catch(() => undefined);
    }
  },
};

function setRefreshTokenCookie(token: string): void {
  if (typeof document === "undefined" || !token) return;
  document.cookie = `mnglib_refresh=${token}; path=/; max-age=2592000; samesite=lax`;
}

function clearRefreshTokenCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = "mnglib_refresh=; path=/; max-age=0";
}

function getRegistrationStatusError(status: number): string | null {
  switch (status) {
    case 409:
      return "Email or username is already registered.";
    case 422:
      return "Email, username and a password with at least 8 characters are required.";
    default:
      return null;
  }
}
