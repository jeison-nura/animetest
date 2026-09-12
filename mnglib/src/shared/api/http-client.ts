import { tokenStorage } from "./token-storage";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export function isMockMode(): boolean {
  return API_BASE_URL === "";
}

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RequestOptions = {
  query?: Record<string, string | number | boolean | null | undefined>;
  body?: unknown;
  signal?: AbortSignal;
};

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  const url = `${API_BASE_URL}${path}`;
  if (!query) {
    return url;
  }

  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value));
    }
  }

  const queryString = searchParams.toString();
  return queryString ? `${url}?${queryString}` : url;
}

async function request<TResponse>(
  method: HttpMethod,
  path: string,
  options: RequestOptions = {}
): Promise<TResponse> {
  const headers = new Headers({ Accept: "application/json" });
  const token = tokenStorage.get();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(buildUrl(path, options.query), {
    method,
    headers,
    credentials: "include",
    signal: options.signal,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined" && !path.startsWith("/auth/")) {
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ refreshToken: getRefreshToken() }),
        });

        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          tokenStorage.set(data.accessToken);
          setRefreshToken(data.refreshToken);
          return request<TResponse>(method, path, options);
        }
      } catch {
        // Refresh failed; fall through to logout
      }

      tokenStorage.clear();
      clearRefreshToken();
      window.location.assign("/login");
    }
    throw new ApiError(
      response.status,
      `Request to ${path} failed with status ${response.status}`
    );
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  return (await response.json()) as TResponse;
}

function getRefreshToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/mnglib_refresh=([^;]*)/);
  return match ? match[1] : null;
}

function setRefreshToken(token: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `mnglib_refresh=${token}; path=/; max-age=2592000; samesite=lax`;
}

function clearRefreshToken(): void {
  if (typeof document === "undefined") return;
  document.cookie = "mnglib_refresh=; path=/; max-age=0";
}

export const http = {
  get: <TResponse>(path: string, options?: RequestOptions) =>
    request<TResponse>("GET", path, options),
  post: <TResponse>(path: string, options?: RequestOptions) =>
    request<TResponse>("POST", path, options),
  put: <TResponse>(path: string, options?: RequestOptions) =>
    request<TResponse>("PUT", path, options),
  patch: <TResponse>(path: string, options?: RequestOptions) =>
    request<TResponse>("PATCH", path, options),
  delete: <TResponse>(path: string, options?: RequestOptions) =>
    request<TResponse>("DELETE", path, options),
};
