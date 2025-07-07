import { projects, buildLogs, type Project, type InsertProject, type BuildLog, type InsertBuildLog, type User, type InsertUser } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Project methods
  createProject(project: InsertProject): Promise<Project>;
  getProject(id: number): Promise<Project | undefined>;
  updateProject(id: number, updates: Partial<Project>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
  getAllProjects(): Promise<Project[]>;
  
  // Build log methods
  addBuildLog(log: InsertBuildLog): Promise<BuildLog>;
  getBuildLogs(projectId: number): Promise<BuildLog[]>;
  clearBuildLogs(projectId: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private buildLogs: Map<number, BuildLog>;
  private userIdCounter: number;
  private projectIdCounter: number;
  private logIdCounter: number;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.buildLogs = new Map();
    this.userIdCounter = 1;
    this.projectIdCounter = 1;
    this.logIdCounter = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Project methods
  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.projectIdCounter++;
    const now = new Date();
    const project: Project = {
      ...insertProject,
      id,
      createdAt: now,
      updatedAt: now,
      status: insertProject.status || "uploaded",
      progress: insertProject.progress || 0,
      buildConfig: insertProject.buildConfig || null,
      projectStats: insertProject.projectStats || null,
      logs: insertProject.logs || [],
      apkPath: insertProject.apkPath || null,
      apkSize: insertProject.apkSize || null,
      framework: insertProject.framework || null,
    };
    this.projects.set(id, project);
    return project;
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async updateProject(id: number, updates: Partial<Project>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updatedProject = {
      ...project,
      ...updates,
      updatedAt: new Date(),
    };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }

  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  // Build log methods
  async addBuildLog(insertLog: InsertBuildLog): Promise<BuildLog> {
    const id = this.logIdCounter++;
    const log: BuildLog = {
      ...insertLog,
      id,
      timestamp: new Date(),
    };
    this.buildLogs.set(id, log);
    return log;
  }

  async getBuildLogs(projectId: number): Promise<BuildLog[]> {
    return Array.from(this.buildLogs.values()).filter(
      (log) => log.projectId === projectId
    );
  }

  async clearBuildLogs(projectId: number): Promise<void> {
    const logsToDelete = Array.from(this.buildLogs.entries())
      .filter(([_, log]) => log.projectId === projectId)
      .map(([id, _]) => id);
    
    logsToDelete.forEach(id => this.buildLogs.delete(id));
  }
}

export const storage = new MemStorage();
