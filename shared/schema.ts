import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  originalFileName: text("original_file_name").notNull(),
  fileSize: integer("file_size").notNull(),
  framework: text("framework"),
  status: text("status").notNull().default("uploaded"), // uploaded, analyzing, building, completed, error
  progress: integer("progress").notNull().default(0),
  buildConfig: jsonb("build_config"),
  projectStats: jsonb("project_stats"),
  logs: jsonb("logs").default([]),
  apkPath: text("apk_path"),
  apkSize: integer("apk_size"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const buildLogs = pgTable("build_logs", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  level: text("level").notNull(), // info, warning, error
  message: text("message").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  name: true,
  originalFileName: true,
  fileSize: true,
  framework: true,
  status: true,
  progress: true,
  buildConfig: true,
  projectStats: true,
  logs: true,
  apkPath: true,
  apkSize: true,
});

export const insertBuildLogSchema = createInsertSchema(buildLogs).pick({
  projectId: true,
  level: true,
  message: true,
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertBuildLog = z.infer<typeof insertBuildLogSchema>;
export type BuildLog = typeof buildLogs.$inferSelect;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
