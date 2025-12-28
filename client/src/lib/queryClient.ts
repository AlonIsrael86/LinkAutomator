import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Function to get Clerk token - will be set by the app
let getToken: (() => Promise<string | null>) | null = null;

export function setTokenGetter(getter: () => Promise<string | null>) {
  getToken = getter;
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const baseUrl = (typeof window !== 'undefined' && window.location.hostname === 'localhost') 
    ? 'http://localhost:5000' 
    : '';
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
  
  // Get token from Clerk
  const token = getToken ? await getToken() : null;
  
  const headers: Record<string, string> = {};
  if (data) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  const res = await fetch(fullUrl, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const baseUrl = (typeof window !== 'undefined' && window.location.hostname === 'localhost') 
      ? 'http://localhost:5000' 
      : '';
    const url = queryKey.join("/") as string;
    const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
    
    // Get token from Clerk
    const token = getToken ? await getToken() : null;
    
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    
    const res = await fetch(fullUrl, {
      credentials: "include",
      headers,
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60, // 1 minute
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
