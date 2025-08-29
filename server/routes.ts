import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLinkSchema, insertWebhookSchema, insertCustomDomainSchema, insertApiTokenSchema } from "@shared/schema";
import { randomBytes } from "crypto";
import axios from "axios";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes
  // Links
  app.get("/api/links", async (req, res) => {
    try {
      const links = await storage.getAllLinks();
      res.json(links);
    } catch (error) {
      console.error('Get links error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/links/top", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const topLinks = await storage.getTopLinks(limit);
      res.json(topLinks);
    } catch (error) {
      console.error('Get top links error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/links", async (req, res) => {
    try {
      console.log("API received data:", JSON.stringify(req.body, null, 2));
      const validatedData = insertLinkSchema.parse(req.body);
      console.log("Validation passed, creating link...");
      const link = await storage.createLink(validatedData);
      console.log("Link created successfully:", link.shortCode);

      // Send webhook notification for link creation
      if (link.enableWebhook && link.webhookUrl) {
        try {
          console.log(`Sending webhook to: ${link.webhookUrl}`);
          
          // Extract IP address from request - Enhanced for production
          let creatorIP = 'unknown';
          
          // Try multiple sources for real client IP
          if (req.headers['cf-connecting-ip']) {
            // Cloudflare
            creatorIP = req.headers['cf-connecting-ip'].toString();
          } else if (req.headers['x-forwarded-for']) {
            // Standard proxy header - get first IP
            const forwardedIps = req.headers['x-forwarded-for'].toString().split(',');
            creatorIP = forwardedIps[0].trim();
          } else if (req.headers['x-real-ip']) {
            // Nginx proxy
            creatorIP = req.headers['x-real-ip'].toString();
          } else if (req.headers['x-client-ip']) {
            // Alternative header
            creatorIP = req.headers['x-client-ip'].toString();
          } else if (req.connection.remoteAddress) {
            // Direct connection
            creatorIP = req.connection.remoteAddress;
          } else if (req.socket.remoteAddress) {
            // Socket connection
            creatorIP = req.socket.remoteAddress;
          } else if (req.ip) {
            // Express.js req.ip
            creatorIP = req.ip;
          }
          
          // Clean up IPv6 localhost to IPv4
          if (creatorIP === '::1') {
            creatorIP = '127.0.0.1';
          }
          
          console.log(`Client IP detected: ${creatorIP}`);
          
          const webhookPayload = {
            event: 'link_created',
            link: {
              id: link.id,
              shortCode: link.shortCode,
              title: link.title,
              targetUrl: link.targetUrl,
              domain: link.domain,
              createdAt: link.createdAt
            },
            creator: {
              ipAddress: creatorIP,
              userAgent: req.headers['user-agent'] || '',
              timestamp: new Date().toISOString()
            },
            timestamp: new Date().toISOString()
          };
          
          console.log("Webhook payload:", JSON.stringify(webhookPayload, null, 2));
          console.log(`🚀 Webhook URL being called: ${link.webhookUrl}`);
          console.log(`📦 Payload includes creator.ipAddress: ${webhookPayload.creator.ipAddress}`);
          
          const webhookResponse = await axios.post(link.webhookUrl, webhookPayload, {
            timeout: 10000, // 10 seconds timeout
            headers: {
              'Content-Type': 'application/json',
              'User-Agent': 'Link-Automator-Webhook/1.0'
            }
          });
          
          console.log(`Webhook delivered successfully. Status: ${webhookResponse.status}`);
        } catch (webhookError: any) {
          console.error('⚠️ Webhook delivery failed:', {
            url: link.webhookUrl,
            error: webhookError.message,
            response: webhookError.response?.data,
            status: webhookError.response?.status
          });
          // Don't fail the link creation if webhook fails
        }
      }

      res.status(201).json(link);
    } catch (error: any) {
      console.error('Create link error:', error);
      console.error('Error type:', typeof error);
      console.error('Error message:', error.message);
      
      if (error.message === "Custom slug is already taken") {
        return res.status(400).json({ message: error.message });
      }
      
      // Check if it's a Zod validation error
      if (error.name === 'ZodError') {
        console.error('Zod validation errors:', error.issues);
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: error.issues 
        });
      }
      
      res.status(400).json({ message: "Invalid link data" });
    }
  });

  app.get("/api/links/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const link = await storage.getLinkById(id);
      if (!link) {
        return res.status(404).json({ message: "Link not found" });
      }
      res.json(link);
    } catch (error) {
      console.error('Get link error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/links/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const link = await storage.updateLink(id, updates);
      if (!link) {
        return res.status(404).json({ message: "Link not found" });
      }
      res.json(link);
    } catch (error) {
      console.error('Update link error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/links/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteLink(id);
      if (!deleted) {
        return res.status(404).json({ message: "Link not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error('Delete link error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Analytics
  app.get("/api/analytics", async (req, res) => {
    try {
      const { linkId, startDate, endDate } = req.query;
      const start = startDate ? new Date(startDate as string) : undefined;
      const end = endDate ? new Date(endDate as string) : undefined;
      
      const analytics = await storage.getClicksAnalytics(linkId as string, start, end);
      res.json(analytics);
    } catch (error) {
      console.error('Get analytics error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/analytics/dashboard", async (req, res) => {
    try {
      const now = new Date();
      const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const [totalLinks, weeklyAnalytics, monthlyAnalytics, topLinks] = await Promise.all([
        storage.getAllLinks(),
        storage.getClicksAnalytics(undefined, lastWeek),
        storage.getClicksAnalytics(undefined, lastMonth),
        storage.getTopLinks(5)
      ]);

      const stats = {
        totalLinks: totalLinks.length,
        totalClicks: monthlyAnalytics.totalClicks,
        clickRate: totalLinks.length > 0 ? (monthlyAnalytics.totalClicks / totalLinks.length).toFixed(1) : "0",
        activeWebhooks: totalLinks.filter(link => link.enableWebhook).length,
        weeklyClicks: weeklyAnalytics.totalClicks,
        topLinks
      };

      res.json(stats);
    } catch (error) {
      console.error('Get dashboard analytics error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Export analytics as CSV
  app.get("/api/analytics/export", async (req, res) => {
    try {
      const { linkId, startDate, endDate } = req.query;
      const start = startDate ? new Date(startDate as string) : undefined;
      const end = endDate ? new Date(endDate as string) : undefined;
      
      let clicks;
      if (linkId) {
        clicks = await storage.getClicksByLinkId(linkId as string);
      } else {
        // Get all clicks for all links
        const links = await storage.getAllLinks();
        clicks = [];
        for (const link of links) {
          const linkClicks = await storage.getClicksByLinkId(link.id);
          clicks.push(...linkClicks);
        }
      }

      // Filter by date if provided
      if (start || end) {
        clicks = clicks.filter(click => {
          const clickDate = click.clickedAt ? new Date(click.clickedAt) : new Date();
          if (start && clickDate < start) return false;
          if (end && clickDate > end) return false;
          return true;
        });
      }

      // Generate CSV
      const csvHeader = "Date,Link ID,IP Address,User Agent,Referer,Device,Browser,OS\n";
      const csvData = clicks.map(click => 
        `${click.clickedAt?.toISOString() || new Date().toISOString()},${click.linkId},"${click.ipAddress}","${click.userAgent}","${click.referer}","${click.device}","${click.browser}","${click.os}"`
      ).join("\n");

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="analytics.csv"');
      res.send(csvHeader + csvData);
    } catch (error) {
      console.error('Export analytics error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Webhooks
  app.get("/api/webhooks", async (req, res) => {
    try {
      const webhooks = await storage.getWebhooks();
      res.json(webhooks);
    } catch (error) {
      console.error('Get webhooks error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/webhooks", async (req, res) => {
    try {
      const validatedData = insertWebhookSchema.parse(req.body);
      const webhook = await storage.createWebhook(validatedData);
      res.status(201).json(webhook);
    } catch (error) {
      console.error('Create webhook error:', error);
      res.status(400).json({ message: "Invalid webhook data" });
    }
  });

  app.put("/api/webhooks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const webhook = await storage.updateWebhook(id, updates);
      if (!webhook) {
        return res.status(404).json({ message: "Webhook not found" });
      }
      res.json(webhook);
    } catch (error) {
      console.error('Update webhook error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/webhooks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteWebhook(id);
      if (!deleted) {
        return res.status(404).json({ message: "Webhook not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error('Delete webhook error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Custom Domains
  app.get("/api/domains", async (req, res) => {
    try {
      const domains = await storage.getCustomDomains();
      res.json(domains);
    } catch (error) {
      console.error('Get domains error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/domains", async (req, res) => {
    try {
      const validatedData = insertCustomDomainSchema.parse(req.body);
      const domain = await storage.createCustomDomain(validatedData);
      res.status(201).json(domain);
    } catch (error) {
      console.error('Create domain error:', error);
      res.status(400).json({ message: "Invalid domain data" });
    }
  });

  // API Tokens
  app.get("/api/tokens", async (req, res) => {
    try {
      const tokens = await storage.getApiTokens();
      res.json(tokens);
    } catch (error) {
      console.error('Get tokens error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/tokens", async (req, res) => {
    try {
      const { name } = req.body;
      const token = randomBytes(32).toString('hex');
      const apiToken = await storage.createApiToken({
        name,
        token,
        isActive: true
      });
      res.status(201).json(apiToken);
    } catch (error) {
      console.error('Create token error:', error);
      res.status(400).json({ message: "Invalid token data" });
    }
  });

  app.delete("/api/tokens/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteApiToken(id);
      if (!deleted) {
        return res.status(404).json({ message: "Token not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error('Delete token error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Redirect route - handles short link clicks (placed LAST so it doesn't interfere with API routes)
  app.get("/:shortCode", async (req, res) => {
    try {
      const { shortCode } = req.params;
      
      // Skip certain paths that shouldn't be treated as short codes
      if (shortCode.startsWith('@') || 
          shortCode.startsWith('_') || 
          shortCode.startsWith('src') ||
          shortCode.startsWith('api') ||
          shortCode.startsWith('node_modules') ||
          shortCode.endsWith('.js') ||
          shortCode.endsWith('.css') ||
          shortCode.endsWith('.html') ||
          shortCode.endsWith('.ico') ||
          shortCode.endsWith('.png') ||
          shortCode.endsWith('.svg') ||
          shortCode.endsWith('.jpg') ||
          shortCode.endsWith('.jpeg') ||
          shortCode === 'favicon.ico' ||
          shortCode === 'robots.txt') {
        return res.status(404).json({ message: "Not found" });
      }
      
      // Get the domain from the request host header
      const requestDomain = req.headers.host?.replace(/:\d+$/, '') || '';
      console.log(`Redirect request - shortCode: ${shortCode}, domain: ${requestDomain}`);
      
      // First try to find link by shortCode and domain
      let link = await storage.getLinkByShortCodeAndDomain(shortCode, requestDomain);
      console.log(`Link found by domain+shortCode: ${link ? 'YES' : 'NO'}`);
      
      // If not found, fallback to just shortCode (for backward compatibility)
      if (!link) {
        link = await storage.getLinkByShortCode(shortCode);
      }
      
      if (!link || !link.isActive) {
        return res.status(404).json({ message: "Link not found" });
      }

      // Record click analytics
      const userAgent = req.headers['user-agent'] || '';
      const referer = req.headers['referer'] || '';
      const ipAddress = req.ip || req.connection.remoteAddress || '';

      await storage.recordClick({
        linkId: link.id,
        ipAddress,
        userAgent,
        referer,
        device: extractDevice(userAgent),
        browser: extractBrowser(userAgent),
        os: extractOS(userAgent)
      });

      // Send webhook if enabled
      if (link.enableWebhook && link.webhookUrl) {
        try {
          await axios.post(link.webhookUrl, {
            event: 'click',
            link: {
              id: link.id,
              shortCode: link.shortCode,
              title: link.title,
              targetUrl: link.targetUrl
            },
            click: {
              ipAddress,
              userAgent,
              referer,
              timestamp: new Date().toISOString()
            }
          });
        } catch (error) {
          console.error('Webhook error:', error);
        }
      }

      // Handle conditional redirects
      if (link.enableConditionals && link.conditionalRules) {
        const rules = link.conditionalRules as any;
        // Simple device-based redirect logic
        if (rules.mobile && isMobile(userAgent)) {
          return res.redirect(rules.mobile);
        }
        if (rules.desktop && !isMobile(userAgent)) {
          return res.redirect(rules.desktop);
        }
      }

      return res.redirect(link.targetUrl);
    } catch (error) {
      console.error('Redirect error:', error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Utility functions
function extractDevice(userAgent: string): string {
  if (/mobile/i.test(userAgent)) return 'Mobile';
  if (/tablet/i.test(userAgent)) return 'Tablet';
  return 'Desktop';
}

function extractBrowser(userAgent: string): string {
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  return 'Other';
}

function extractOS(userAgent: string): string {
  if (userAgent.includes('Windows')) return 'Windows';
  if (userAgent.includes('Mac')) return 'macOS';
  if (userAgent.includes('Linux')) return 'Linux';
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('iOS')) return 'iOS';
  return 'Other';
}

function isMobile(userAgent: string): boolean {
  return /mobile/i.test(userAgent);
}
