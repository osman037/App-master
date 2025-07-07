import fs from 'fs/promises';
import path from 'path';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import AdmZip from 'adm-zip';

export class FileManager {
  private uploadDir: string;
  private buildDir: string;

  constructor() {
    this.uploadDir = path.join(process.cwd(), 'uploads');
    this.buildDir = path.join(process.cwd(), 'builds');
    this.ensureDirectories();
  }

  private async ensureDirectories() {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
      await fs.mkdir(this.buildDir, { recursive: true });
    } catch (error) {
      console.error('Error creating directories:', error);
    }
  }

  async saveUploadedFile(buffer: Buffer, filename: string): Promise<string> {
    const filePath = path.join(this.uploadDir, filename);
    await fs.writeFile(filePath, buffer);
    return filePath;
  }

  async extractZip(zipPath: string, extractPath: string): Promise<void> {
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(extractPath, true);
  }

  async getProjectDirectory(projectId: number): Promise<string> {
    const projectDir = path.join(this.buildDir, `project_${projectId}`);
    await fs.mkdir(projectDir, { recursive: true });
    return projectDir;
  }

  async readFile(filePath: string): Promise<string> {
    return await fs.readFile(filePath, 'utf-8');
  }

  async writeFile(filePath: string, content: string): Promise<void> {
    await fs.writeFile(filePath, content);
  }

  async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async listFiles(directory: string): Promise<string[]> {
    try {
      const files = await fs.readdir(directory, { withFileTypes: true });
      return files
        .filter(dirent => dirent.isFile()) // Only return files, not directories
        .map(dirent => dirent.name);
    } catch {
      return [];
    }
  }

  async listDirectories(directory: string): Promise<string[]> {
    try {
      const files = await fs.readdir(directory, { withFileTypes: true });
      return files
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
    } catch {
      return [];
    }
  }

  async getFileStats(filePath: string): Promise<{ size: number; isDirectory: boolean } | null> {
    try {
      const stats = await fs.stat(filePath);
      return {
        size: stats.size,
        isDirectory: stats.isDirectory(),
      };
    } catch {
      return null;
    }
  }

  async deleteDirectory(directory: string): Promise<void> {
    try {
      await fs.rm(directory, { recursive: true, force: true });
    } catch (error) {
      console.error('Error deleting directory:', error);
    }
  }

  async copyFile(source: string, destination: string): Promise<void> {
    await fs.copyFile(source, destination);
  }

  async ensureDirectory(directory: string): Promise<void> {
    await fs.mkdir(directory, { recursive: true });
  }
}
