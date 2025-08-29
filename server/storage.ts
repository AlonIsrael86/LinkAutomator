import { 
  users, 
  links, 
  clicks, 
  webhooks, 
  customDomains, 
  apiTokens,
  type User, 
  type InsertUser,
  type Link,
  type InsertLink,
  type Click,
  type InsertClick,
  type Webhook,
  type InsertWebhook,
  type CustomDomain,
  type InsertCustomDomain,
  type ApiToken,
  type InsertApiToken
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and, gte, between } from "drizzle-orm";
import { randomBytes } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Link methods
  createLink(link: InsertLink): Promise<Link>;
  getLinkByShortCode(shortCode: string): Promise<Link | undefined>;
  getLinkById(id: string): Promise<Link | undefined>;
  updateLink(id: string, updates: Partial<InsertLink>): Promise<Link | undefined>;
  deleteLink(id: string): Promise<boolean>;
  getAllLinks(): Promise<Link[]>;
  getTopLinks(limit?: number): Promise<(Link & { clickCount: number })[]>;

  // Click methods
  recordClick(click: InsertClick): Promise<Click>;
  getClicksByLinkId(linkId: string): Promise<Click[]>;
  getClicksAnalytics(linkId?: string, startDate?: Date, endDate?: Date): Promise<{
    totalClicks: number;
    uniqueClicks: number;
    clicksByDay: { date: string; clicks: number }[];
  }>;

  // Webhook methods
  createWebhook(webhook: InsertWebhook): Promise<Webhook>;
  getWebhooks(): Promise<Webhook[]>;
  updateWebhook(id: string, updates: Partial<InsertWebhook>): Promise<Webhook | undefined>;
  deleteWebhook(id: string): Promise<boolean>;

  // Custom domain methods
  createCustomDomain(domain: InsertCustomDomain): Promise<CustomDomain>;
  getCustomDomains(): Promise<CustomDomain[]>;
  updateCustomDomain(id: string, updates: Partial<InsertCustomDomain>): Promise<CustomDomain | undefined>;
  deleteCustomDomain(id: string): Promise<boolean>;

  // API token methods
  createApiToken(token: InsertApiToken): Promise<ApiToken>;
  getApiTokens(): Promise<ApiToken[]>;
  getApiTokenByToken(token: string): Promise<ApiToken | undefined>;
  updateApiToken(id: string, updates: Partial<InsertApiToken>): Promise<ApiToken | undefined>;
  deleteApiToken(id: string): Promise<boolean>;

  // Utility methods
  generateShortCode(): Promise<string>;
  isShortCodeAvailable(shortCode: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createLink(link: InsertLink): Promise<Link> {
    let shortCode = link.customSlug;
    if (!shortCode) {
      shortCode = await this.generateShortCode();
    } else {
      const isAvailable = await this.isShortCodeAvailable(shortCode);
      if (!isAvailable) {
        throw new Error("Custom slug is already taken");
      }
    }

    const [newLink] = await db
      .insert(links)
      .values({
        ...link,
        shortCode,
        updatedAt: new Date()
      })
      .returning();
    return newLink;
  }

  async getLinkByShortCode(shortCode: string): Promise<Link | undefined> {
    const [link] = await db.select().from(links).where(eq(links.shortCode, shortCode));
    return link || undefined;
  }

  async getLinkById(id: string): Promise<Link | undefined> {
    const [link] = await db.select().from(links).where(eq(links.id, id));
    return link || undefined;
  }

  async updateLink(id: string, updates: Partial<InsertLink>): Promise<Link | undefined> {
    const [updated] = await db
      .update(links)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(links.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteLink(id: string): Promise<boolean> {
    const result = await db.delete(links).where(eq(links.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getAllLinks(): Promise<Link[]> {
    return await db.select().from(links).orderBy(desc(links.createdAt));
  }

  async getTopLinks(limit = 10): Promise<(Link & { clickCount: number })[]> {
    const result = await db
      .select({
        id: links.id,
        shortCode: links.shortCode,
        targetUrl: links.targetUrl,
        title: links.title,
        customSlug: links.customSlug,
        domain: links.domain,
        isActive: links.isActive,
        webhookUrl: links.webhookUrl,
        enableWebhook: links.enableWebhook,
        conditionalRules: links.conditionalRules,
        enableConditionals: links.enableConditionals,
        createdAt: links.createdAt,
        updatedAt: links.updatedAt,
        clickCount: sql<number>`count(${clicks.id})`
      })
      .from(links)
      .leftJoin(clicks, eq(links.id, clicks.linkId))
      .groupBy(links.id)
      .orderBy(desc(sql`count(${clicks.id})`))
      .limit(limit);
    
    return result.map(row => ({
      ...row,
      clickCount: Number(row.clickCount) || 0
    }));
  }

  async recordClick(click: InsertClick): Promise<Click> {
    const [newClick] = await db
      .insert(clicks)
      .values(click)
      .returning();
    return newClick;
  }

  async getClicksByLinkId(linkId: string): Promise<Click[]> {
    return await db.select().from(clicks).where(eq(clicks.linkId, linkId)).orderBy(desc(clicks.clickedAt));
  }

  async getClicksAnalytics(linkId?: string, startDate?: Date, endDate?: Date) {
    let query = db.select().from(clicks);
    
    const conditions: any[] = [];
    if (linkId) conditions.push(eq(clicks.linkId, linkId));
    if (startDate && endDate) conditions.push(between(clicks.clickedAt, startDate, endDate));
    else if (startDate) conditions.push(gte(clicks.clickedAt, startDate));
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const allClicks = await query;
    
    const totalClicks = allClicks.length;
    const uniqueClicks = new Set(allClicks.map(c => c.ipAddress)).size;
    
    // Group clicks by day
    const clicksByDay = allClicks.reduce((acc, click) => {
      const date = click.clickedAt?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const clicksByDayArray = Object.entries(clicksByDay).map(([date, clicks]) => ({
      date,
      clicks
    }));

    return {
      totalClicks,
      uniqueClicks,
      clicksByDay: clicksByDayArray
    };
  }

  async createWebhook(webhook: InsertWebhook): Promise<Webhook> {
    const [newWebhook] = await db
      .insert(webhooks)
      .values(webhook)
      .returning();
    return newWebhook;
  }

  async getWebhooks(): Promise<Webhook[]> {
    return await db.select().from(webhooks).orderBy(desc(webhooks.createdAt));
  }

  async updateWebhook(id: string, updates: Partial<InsertWebhook>): Promise<Webhook | undefined> {
    const [updated] = await db
      .update(webhooks)
      .set(updates)
      .where(eq(webhooks.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteWebhook(id: string): Promise<boolean> {
    const result = await db.delete(webhooks).where(eq(webhooks.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async createCustomDomain(domain: InsertCustomDomain): Promise<CustomDomain> {
    const [newDomain] = await db
      .insert(customDomains)
      .values(domain)
      .returning();
    return newDomain;
  }

  async getCustomDomains(): Promise<CustomDomain[]> {
    return await db.select().from(customDomains).orderBy(desc(customDomains.createdAt));
  }

  async updateCustomDomain(id: string, updates: Partial<InsertCustomDomain>): Promise<CustomDomain | undefined> {
    const [updated] = await db
      .update(customDomains)
      .set(updates)
      .where(eq(customDomains.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteCustomDomain(id: string): Promise<boolean> {
    const result = await db.delete(customDomains).where(eq(customDomains.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async createApiToken(token: InsertApiToken): Promise<ApiToken> {
    const [newToken] = await db
      .insert(apiTokens)
      .values(token)
      .returning();
    return newToken;
  }

  async getApiTokens(): Promise<ApiToken[]> {
    return await db.select().from(apiTokens).orderBy(desc(apiTokens.createdAt));
  }

  async getApiTokenByToken(token: string): Promise<ApiToken | undefined> {
    const [apiToken] = await db.select().from(apiTokens).where(eq(apiTokens.token, token));
    return apiToken || undefined;
  }

  async updateApiToken(id: string, updates: Partial<InsertApiToken>): Promise<ApiToken | undefined> {
    const [updated] = await db
      .update(apiTokens)
      .set(updates)
      .where(eq(apiTokens.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteApiToken(id: string): Promise<boolean> {
    const result = await db.delete(apiTokens).where(eq(apiTokens.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async generateShortCode(): Promise<string> {
    let shortCode: string;
    let isAvailable = false;
    
    while (!isAvailable) {
      shortCode = randomBytes(4).toString('hex');
      isAvailable = await this.isShortCodeAvailable(shortCode);
    }
    
    return shortCode!;
  }

  async isShortCodeAvailable(shortCode: string): Promise<boolean> {
    const [existing] = await db.select().from(links).where(eq(links.shortCode, shortCode));
    return !existing;
  }
}

export const storage = new DatabaseStorage();
