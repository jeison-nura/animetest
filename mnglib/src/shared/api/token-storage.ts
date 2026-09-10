const TOKEN_KEY = "mnglib.session-token";

export const tokenStorage = {
  get(): string | null {
    if (typeof window === "undefined") {
      return null;
    }
    return window.sessionStorage.getItem(TOKEN_KEY);
  },
  set(token: string): void {
    if (typeof window === "undefined") {
      return;
    }
    window.sessionStorage.setItem(TOKEN_KEY, token);
  },
  clear(): void {
    if (typeof window === "undefined") {
      return;
    }
    window.sessionStorage.removeItem(TOKEN_KEY);
  },
};
