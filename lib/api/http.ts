import { env } from "@/lib/env";
import { getAuthToken } from "@/lib/auth/store";

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

function buildUrl(path: string) {
  return `${env.NEXT_PUBLIC_API_BASE_URL}${path}`;
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

  const response = await fetch(buildUrl(path), {
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
  const response = await fetch(buildUrl(path), {
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
