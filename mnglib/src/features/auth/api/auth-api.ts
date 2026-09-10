import { userApi, type User } from "@entities/user";

import { http, isMockMode, mockDelay, tokenStorage } from "@shared/api";

export type LoginResponse = {
  token: string;
  user: User;
};

export const authApi = {
  async login(email: string, password: string): Promise<LoginResponse> {
    if (isMockMode()) {
      await mockDelay();
      const user = await userApi.getProfile();
      const response: LoginResponse = { token: "mock-session-token", user };
      tokenStorage.set(response.token);
      return response;
    }

    const response = await http.post<LoginResponse>("/auth/login", {
      body: { email, password },
    });
    tokenStorage.set(response.token);
    return response;
  },

  async logout(): Promise<void> {
    tokenStorage.clear();

    if (!isMockMode()) {
      await http.post<void>("/auth/logout").catch(() => undefined);
    }
  },
};
