import { 
  type User, 
  type InsertUser,
  type Project,
  type InsertProject,
  type StoryNode,
  type InsertStoryNode,
  type NodeGroup,
  type InsertNodeGroup,
  type Asset,
  type InsertAsset,
  projects,
  storyNodes,
  nodeGroups,
  assets,
  users
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Project methods
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, updates: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
  
  // Story Node methods
  getProjectNodes(projectId: number): Promise<StoryNode[]>;
  getNode(projectId: number, nodeId: string): Promise<StoryNode | undefined>;
  createNode(node: InsertStoryNode): Promise<StoryNode>;
  updateNode(projectId: number, nodeId: string, updates: Partial<InsertStoryNode>): Promise<StoryNode | undefined>;
  deleteNode(projectId: number, nodeId: string): Promise<boolean>;
  
  // Node Group methods
  getProjectGroups(projectId: number): Promise<NodeGroup[]>;
  createGroup(group: InsertNodeGroup): Promise<NodeGroup>;
  updateGroup(projectId: number, groupId: string, updates: Partial<InsertNodeGroup>): Promise<NodeGroup | undefined>;
  deleteGroup(projectId: number, groupId: string): Promise<boolean>;
  
  // Asset methods
  getProjectAssets(projectId: number): Promise<Asset[]>;
  createAsset(asset: InsertAsset): Promise<Asset>;
  deleteAsset(projectId: number, assetId: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User methods
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
  
  // Project methods
  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(projects.updatedAt);
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || undefined;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db
      .insert(projects)
      .values(project as any)
      .returning();
    return newProject;
  }

  async updateProject(id: number, updates: Partial<InsertProject>): Promise<Project | undefined> {
    const [updatedProject] = await db
      .update(projects)
      .set({ ...updates as any, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return updatedProject || undefined;
  }

  async deleteProject(id: number): Promise<boolean> {
    // Delete related data first
    await db.delete(storyNodes).where(eq(storyNodes.projectId, id));
    await db.delete(nodeGroups).where(eq(nodeGroups.projectId, id));
    await db.delete(assets).where(eq(assets.projectId, id));
    
    const result = await db.delete(projects).where(eq(projects.id, id));
    return (result.rowCount ?? 0) > 0;
  }
  
  // Story Node methods
  async getProjectNodes(projectId: number): Promise<StoryNode[]> {
    return await db.select().from(storyNodes)
      .where(eq(storyNodes.projectId, projectId))
      .orderBy(storyNodes.createdAt);
  }

  async getNode(projectId: number, nodeId: string): Promise<StoryNode | undefined> {
    const [node] = await db.select().from(storyNodes)
      .where(and(eq(storyNodes.projectId, projectId), eq(storyNodes.nodeId, nodeId)));
    return node || undefined;
  }

  async createNode(node: InsertStoryNode): Promise<StoryNode> {
    const [newNode] = await db
      .insert(storyNodes)
      .values(node as any)
      .returning();
    return newNode;
  }

  async updateNode(projectId: number, nodeId: string, updates: Partial<InsertStoryNode>): Promise<StoryNode | undefined> {
    const [updatedNode] = await db
      .update(storyNodes)
      .set({ ...updates as any, updatedAt: new Date() })
      .where(and(eq(storyNodes.projectId, projectId), eq(storyNodes.nodeId, nodeId)))
      .returning();
    return updatedNode || undefined;
  }

  async deleteNode(projectId: number, nodeId: string): Promise<boolean> {
    const result = await db.delete(storyNodes)
      .where(and(eq(storyNodes.projectId, projectId), eq(storyNodes.nodeId, nodeId)));
    return (result.rowCount ?? 0) > 0;
  }
  
  // Node Group methods
  async getProjectGroups(projectId: number): Promise<NodeGroup[]> {
    return await db.select().from(nodeGroups)
      .where(eq(nodeGroups.projectId, projectId))
      .orderBy(nodeGroups.createdAt);
  }

  async createGroup(group: InsertNodeGroup): Promise<NodeGroup> {
    const [newGroup] = await db
      .insert(nodeGroups)
      .values(group)
      .returning();
    return newGroup;
  }

  async updateGroup(projectId: number, groupId: string, updates: Partial<InsertNodeGroup>): Promise<NodeGroup | undefined> {
    const [updatedGroup] = await db
      .update(nodeGroups)
      .set(updates)
      .where(and(eq(nodeGroups.projectId, projectId), eq(nodeGroups.groupId, groupId)))
      .returning();
    return updatedGroup || undefined;
  }

  async deleteGroup(projectId: number, groupId: string): Promise<boolean> {
    const result = await db.delete(nodeGroups)
      .where(and(eq(nodeGroups.projectId, projectId), eq(nodeGroups.groupId, groupId)));
    return (result.rowCount ?? 0) > 0;
  }
  
  // Asset methods
  async getProjectAssets(projectId: number): Promise<Asset[]> {
    return await db.select().from(assets)
      .where(eq(assets.projectId, projectId))
      .orderBy(assets.createdAt);
  }

  async createAsset(asset: InsertAsset): Promise<Asset> {
    const [newAsset] = await db
      .insert(assets)
      .values(asset as any)
      .returning();
    return newAsset;
  }

  async deleteAsset(projectId: number, assetId: string): Promise<boolean> {
    const result = await db.delete(assets)
      .where(and(eq(assets.projectId, projectId), eq(assets.assetId, assetId)));
    return (result.rowCount ?? 0) > 0;
  }
}

export const storage = new DatabaseStorage();
