import { useAuth } from "@clerk/clerk-react";
import { apiRequest } from "@/lib/queryClient";

/**
 * Hook to get an authenticated API request function
 * Automatically includes the Clerk session token in requests
 */
export function useApiClient() {
  const { getToken } = useAuth();

  const authenticatedRequest = async (
    method: string,
    url: string,
    data?: unknown
  ): Promise<Response> => {
    const token = await getToken();
    return apiRequest(method, url, data, token || undefined);
  };

  return { apiRequest: authenticatedRequest, getToken };
}





