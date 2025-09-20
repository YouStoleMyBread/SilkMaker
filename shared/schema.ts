import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, jsonb, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Projects table - stores story projects
export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  settings: jsonb('settings').$type<{
    defaultTheme?: string;
    exportSettings?: Record<string, any>;
    canvasSettings?: {
      zoom: number;
      pan: { x: number; y: number };
    };
  }>(),
});

// Story nodes table - stores individual story nodes
export const storyNodes = pgTable('story_nodes', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').references(() => projects.id).notNull(),
  nodeId: text('node_id').notNull(), // Client-side unique identifier
  title: text('title').notNull(),
  content: text('content').notNull(),
  type: text('type').notNull().$type<'start' | 'story' | 'choice' | 'end' | 'css' | 'variable' | 'condition' | 'audio' | 'video'>(),
  position: jsonb('position').$type<{ x: number; y: number }>().notNull(),
  connections: text('connections').array().notNull().default([]),
  color: text('color'),
  variables: jsonb('variables').$type<Record<string, any>>(),
  cssStyles: jsonb('css_styles').$type<{
    fontFamily?: string;
    fontSize?: string;
    textColor?: string;
    backgroundColor?: string;
    backgroundImage?: string;
  }>(),
  audioFile: text('audio_file'),
  videoFile: text('video_file'),
  wordCount: integer('word_count').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Node groups table - stores grouped nodes
export const nodeGroups = pgTable('node_groups', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').references(() => projects.id).notNull(),
  groupId: text('group_id').notNull(), // Client-side unique identifier
  name: text('name').notNull(),
  color: text('color').notNull(),
  nodeIds: text('node_ids').array().notNull().default([]),
  isVisible: boolean('is_visible').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Assets table - stores uploaded media files
export const assets = pgTable('assets', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').references(() => projects.id).notNull(),
  assetId: text('asset_id').notNull(), // Client-side unique identifier
  name: text('name').notNull(),
  type: text('type').notNull().$type<'image' | 'audio' | 'video' | 'gif'>(),
  url: text('url').notNull(),
  size: integer('size').notNull(),
  mimeType: text('mime_type').notNull(),
  thumbnail: text('thumbnail'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Insert schemas for validation
export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertStoryNodeSchema = createInsertSchema(storyNodes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNodeGroupSchema = createInsertSchema(nodeGroups).omit({
  id: true,
  createdAt: true,
});

export const insertAssetSchema = createInsertSchema(assets).omit({
  id: true,
  createdAt: true,
});

// Types
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type StoryNode = typeof storyNodes.$inferSelect;
export type InsertStoryNode = z.infer<typeof insertStoryNodeSchema>;

export type NodeGroup = typeof nodeGroups.$inferSelect;
export type InsertNodeGroup = z.infer<typeof insertNodeGroupSchema>;

export type Asset = typeof assets.$inferSelect;
export type InsertAsset = z.infer<typeof insertAssetSchema>;

// Extended types for frontend
export interface EnhancedStoryNodeData {
  id: string;
  title: string;
  content: string;
  type: 'start' | 'story' | 'choice' | 'end' | 'css' | 'variable' | 'condition' | 'audio' | 'video';
  position: { x: number; y: number };
  connections: string[];
  variables?: Record<string, any>;
  hasImage?: boolean;
  color?: string;
  cssStyles?: {
    fontFamily?: string;
    fontSize?: string;
    textColor?: string;
    backgroundColor?: string;
    backgroundImage?: string;
  };
  audioFile?: string;
  videoFile?: string;
  wordCount?: number;
}

export interface ProjectData {
  id: string;
  name: string;
  description?: string;
  nodeCount: number;
  lastModified: string;
  settings?: {
    defaultTheme?: string;
    exportSettings?: Record<string, any>;
    canvasSettings?: {
      zoom: number;
      pan: { x: number; y: number };
    };
  };
}

export interface NodeGroupData {
  id: string;
  name: string;
  color: string;
  nodeIds: string[];
  isVisible: boolean;
  thumbnail?: string;
}

export interface AssetData {
  id: string;
  name: string;
  type: 'image' | 'audio' | 'video' | 'gif';
  url: string;
  size: number;
  uploadDate: string;
  thumbnail?: string;
}
