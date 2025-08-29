import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const links = pgTable("links", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  shortCode: varchar("short_code", { length: 255 }).notNull().unique(),
  targetUrl: text("target_url").notNull(),
  title: text("title").notNull(),
  customSlug: varchar("custom_slug", { length: 255 }),
  domain: text("domain"),
  isActive: boolean("is_active").default(true),
  webhookUrl: text("webhook_url"),
  enableWebhook: boolean("enable_webhook").default(false),
  conditionalRules: jsonb("conditional_rules"),
  enableConditionals: boolean("enable_conditionals").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const clicks = pgTable("clicks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  linkId: varchar("link_id").notNull().references(() => links.id, { onDelete: "cascade" }),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  referer: text("referer"),
  country: text("country"),
  city: text("city"),
  device: text("device"),
  browser: text("browser"),
  os: text("os"),
  clickedAt: timestamp("clicked_at").defaultNow(),
});

export const webhooks = pgTable("webhooks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  url: text("url").notNull(),
  isActive: boolean("is_active").default(true),
  events: jsonb("events").default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const customDomains = pgTable("custom_domains", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  domain: text("domain").notNull().unique(),
  isVerified: boolean("is_verified").default(false),
  verificationMethod: text("verification_method"), // "CNAME" or "TXT"
  verificationRecord: text("verification_record"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const apiTokens = pgTable("api_tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  token: text("token").notNull().unique(),
  isActive: boolean("is_active").default(true),
  lastUsed: timestamp("last_used"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const linksRelations = relations(links, ({ many }) => ({
  clicks: many(clicks),
}));

export const clicksRelations = relations(clicks, ({ one }) => ({
  link: one(links, {
    fields: [clicks.linkId],
    references: [links.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertLinkSchema = createInsertSchema(links).omit({
  id: true,
  shortCode: true, // Generated automatically by backend
  createdAt: true,
  updatedAt: true,
}).extend({
  targetUrl: z.string().url("Invalid URL format"),
  title: z.string().min(1, "Title is required"),
  customSlug: z.string().optional(),
});

export const insertClickSchema = createInsertSchema(clicks).omit({
  id: true,
  clickedAt: true,
});

export const insertWebhookSchema = createInsertSchema(webhooks).omit({
  id: true,
  createdAt: true,
});

export const insertCustomDomainSchema = createInsertSchema(customDomains).omit({
  id: true,
  createdAt: true,
});

export const insertApiTokenSchema = createInsertSchema(apiTokens).omit({
  id: true,
  createdAt: true,
  lastUsed: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertLink = z.infer<typeof insertLinkSchema>;
export type Link = typeof links.$inferSelect;

export type InsertClick = z.infer<typeof insertClickSchema>;
export type Click = typeof clicks.$inferSelect;

export type InsertWebhook = z.infer<typeof insertWebhookSchema>;
export type Webhook = typeof webhooks.$inferSelect;

export type InsertCustomDomain = z.infer<typeof insertCustomDomainSchema>;
export type CustomDomain = typeof customDomains.$inferSelect;

export type InsertApiToken = z.infer<typeof insertApiTokenSchema>;
export type ApiToken = typeof apiTokens.$inferSelect;
