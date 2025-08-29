import { apiRequest } from "./queryClient";

export interface CreateLinkRequest {
  targetUrl: string;
  title: string;
  customSlug?: string;
  enableWebhook?: boolean;
  webhookUrl?: string;
  enableConditionals?: boolean;
  conditionalRules?: any;
}

export interface LinkStats {
  totalLinks: number;
  totalClicks: number;
  clickRate: string;
  activeWebhooks: number;
  weeklyClicks: number;
}

export interface AnalyticsData {
  totalClicks: number;
  uniqueClicks: number;
  clicksByDay: { date: string; clicks: number }[];
}

export class ApiClient {
  static async createLink(data: CreateLinkRequest) {
    const response = await apiRequest("POST", "/api/links", data);
    return response.json();
  }

  static async getLinks() {
    const response = await apiRequest("GET", "/api/links");
    return response.json();
  }

  static async getTopLinks(limit = 10) {
    const response = await apiRequest("GET", `/api/links/top?limit=${limit}`);
    return response.json();
  }

  static async deleteLink(id: string) {
    await apiRequest("DELETE", `/api/links/${id}`);
  }

  static async getDashboardStats(): Promise<LinkStats> {
    const response = await apiRequest("GET", "/api/analytics/dashboard");
    return response.json();
  }

  static async getAnalytics(linkId?: string, startDate?: Date, endDate?: Date): Promise<AnalyticsData> {
    const params = new URLSearchParams();
    if (linkId) params.append("linkId", linkId);
    if (startDate) params.append("startDate", startDate.toISOString());
    if (endDate) params.append("endDate", endDate.toISOString());
    
    const response = await apiRequest("GET", `/api/analytics?${params}`);
    return response.json();
  }

  static async exportAnalytics(linkId?: string): Promise<Blob> {
    const params = new URLSearchParams();
    if (linkId) params.append("linkId", linkId);
    
    const response = await fetch(`/api/analytics/export?${params}`);
    return response.blob();
  }

  static async createWebhook(data: { name: string; url: string }) {
    const response = await apiRequest("POST", "/api/webhooks", data);
    return response.json();
  }

  static async getWebhooks() {
    const response = await apiRequest("GET", "/api/webhooks");
    return response.json();
  }

  static async deleteWebhook(id: string) {
    await apiRequest("DELETE", `/api/webhooks/${id}`);
  }

  static async testWebhook(url: string) {
    const testPayload = {
      event: 'test',
      link: {
        id: 'test-link-id',
        shortCode: 'test',
        title: 'Test Link',
        targetUrl: 'https://example.com'
      },
      click: {
        ipAddress: '127.0.0.1',
        userAgent: 'Test User Agent',
        referer: 'https://test.com',
        timestamp: new Date().toISOString()
      }
    };
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload)
    });
    
    if (!response.ok) {
      throw new Error('Webhook test failed');
    }
  }

  static async createApiToken(data: { name: string }) {
    const response = await apiRequest("POST", "/api/tokens", data);
    return response.json();
  }

  static async getApiTokens() {
    const response = await apiRequest("GET", "/api/tokens");
    return response.json();
  }

  static async deleteApiToken(id: string) {
    await apiRequest("DELETE", `/api/tokens/${id}`);
  }

  static async createCustomDomain(data: { domain: string; verificationMethod: string }) {
    const response = await apiRequest("POST", "/api/domains", data);
    return response.json();
  }

  static async getCustomDomains() {
    const response = await apiRequest("GET", "/api/domains");
    return response.json();
  }

  static async deleteCustomDomain(id: string) {
    await apiRequest("DELETE", `/api/domains/${id}`);
  }
}
