import { userApi, type User } from "@entities/user";

import { http, isMockMode, mockDelay, tokenStorage } from "@shared/api";

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

export const authApi = {
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
