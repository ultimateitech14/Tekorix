import { env } from "@/lib/env";
import { getAuthToken } from "@/lib/auth/store";

const LEGACY_LOCAL_API_BASE_URLS = new Set(["http://127.0.0.1:8787", "http://localhost:8787"]);
const EXPRESS_LOCAL_API_BASE_URL = "http://127.0.0.1:4001";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data?: T;
};

type RequestOptions<TBody> = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: TBody;
  auth?: boolean;
  token?: string | null;
  signal?: AbortSignal;
};

function normalizeBaseUrl(url: string) {
  return url.replace(/\/$/, "");
}

function buildUrl(path: string, baseUrl = env.NEXT_PUBLIC_API_BASE_URL) {
  return `${normalizeBaseUrl(baseUrl)}${path}`;
}

function shouldRetryWithExpressFallback(error: unknown) {
  if (env.NODE_ENV !== "development") {
    return false;
  }

  if (!(error instanceof TypeError)) {
    return false;
  }

  return LEGACY_LOCAL_API_BASE_URLS.has(normalizeBaseUrl(env.NEXT_PUBLIC_API_BASE_URL));
}

async function fetchWithLocalFallback(path: string, init: RequestInit) {
  try {
    return await fetch(buildUrl(path), init);
  } catch (error) {
    if (!shouldRetryWithExpressFallback(error)) {
      throw error;
    }

    return fetch(buildUrl(path, EXPRESS_LOCAL_API_BASE_URL), init);
  }
}

function getAuthHeaders(auth: boolean, token?: string | null) {
  const headers = new Headers();

  if (!auth) {
    return headers;
  }

  const authToken = token ?? getAuthToken();

  if (!authToken) {
    throw new ApiError(401, "Authentication required.");
  }

  headers.set("Authorization", `Bearer ${authToken}`);

  return headers;
}

async function getErrorMessage(response: Response) {
  let payload: ApiEnvelope<unknown> | null = null;

  try {
    payload = (await response.json()) as ApiEnvelope<unknown>;
  } catch {
    payload = null;
  }

  return payload?.message ?? "Request failed.";
}

export async function requestApi<TResponse, TBody extends Record<string, unknown> | undefined = undefined>(
  path: string,
  options: RequestOptions<TBody> = {},
): Promise<{ data: TResponse; message: string }> {
  const { method = "GET", body, auth = false, token, signal } = options;
  const headers = getAuthHeaders(auth, token);
  headers.set("Content-Type", "application/json");

  const response = await fetchWithLocalFallback(path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
    signal,
  });

  let payload: ApiEnvelope<TResponse> | null = null;

  try {
    payload = (await response.json()) as ApiEnvelope<TResponse>;
  } catch {
    payload = null;
  }

  if (!response.ok || !payload?.success) {
    const message = payload?.message ?? "Request failed.";
    throw new ApiError(response.status, message);
  }

  return {
    data: payload.data as TResponse,
    message: payload.message ?? "Success",
  };
}

export async function requestBinary(path: string, options: Omit<RequestOptions<undefined>, "body"> = {}) {
  const { method = "GET", auth = false, token, signal } = options;
  const headers = getAuthHeaders(auth, token);
  const response = await fetchWithLocalFallback(path, {
    method,
    headers,
    cache: "no-store",
    signal,
  });

  if (!response.ok) {
    throw new ApiError(response.status, await getErrorMessage(response));
  }

  return response;
}
