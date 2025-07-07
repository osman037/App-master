import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import multer from "multer";

interface RequestWithFile extends Request {
  file?: Express.Multer.File;
}
import path from "path";
import { storage } from "./storage";
import { FileManager } from "./services/fileManager";
import { ProjectAnalyzer } from "./services/projectAnalyzer";
import { ApkBuilder } from "./services/apkBuilder";
import { insertProjectSchema, insertBuildLogSchema } from "@shared/schema";
import { z } from "zod";

const upload = multer({ storage: multer.memoryStorage() });
const fileManager = new FileManager();
const projectAnalyzer = new ProjectAnalyzer(fileManager);
const apkBuilder = new ApkBuilder(fileManager);

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Upload project file
  app.post("/api/projects/upload", upload.single("file"), async (req: RequestWithFile, res) => {
    try {
      console.log("Upload request received");
      console.log("File in request:", !!req.file);
      
      if (!req.file) {
        console.log("No file in request");
        return res.status(400).json({ error: "No file uploaded" });
      }

      const { originalname, buffer, size } = req.file;
      console.log(`File details: ${originalname}, size: ${size}`);
      
      // Validate file type
      if (!originalname.endsWith('.zip')) {
        return res.status(400).json({ error: "Only ZIP files are supported" });
      }

      // Create project record first
      const project = await storage.createProject({
        name: originalname.replace('.zip', ''),
        originalFileName: originalname,
        fileSize: size,
        status: "uploaded",
        progress: 10,
      });

      // Add initial log
      await storage.addBuildLog({
        projectId: project.id,
        level: "info",
        message: `Project uploaded: ${originalname} (${size} bytes)`,
      });

      // Save uploaded file
      const filename = `${Date.now()}_${originalname}`;
      const filePath = await fileManager.saveUploadedFile(buffer, filename);

      // Get project directory and extract ZIP immediately
      const projectDir = await fileManager.getProjectDirectory(project.id);
      
      await storage.addBuildLog({
        projectId: project.id,
        level: "info",
        message: "Extracting ZIP file...",
      });

      // Extract ZIP file to project directory
      await fileManager.extractZip(filePath, projectDir);

      await storage.addBuildLog({
        projectId: project.id,
        level: "info",
        message: "ZIP file extracted successfully",
      });

      // Update project status
      await storage.updateProject(project.id, {
        status: "extracted",
        progress: 25,
      });

      res.json({ project: await storage.getProject(project.id) });
    } catch (error: any) {
      console.error("Upload error:", error);
      res.status(500).json({ error: `Upload failed: ${error?.message || 'Unknown error'}` });
    }
  });

  // Get project details
  app.get("/api/projects/:id", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const project = await storage.getProject(projectId);
      
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      res.json(project);
    } catch (error) {
      console.error("Get project error:", error);
      res.status(500).json({ error: "Failed to get project" });
    }
  });

  // Get all projects
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      console.error("Get projects error:", error);
      res.status(500).json({ error: "Failed to get projects" });
    }
  });

  // Analyze project
  app.post("/api/projects/:id/analyze", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const project = await storage.getProject(projectId);
      
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      // Update project status
      await storage.updateProject(projectId, {
        status: "analyzing",
        progress: 10,
      });

      await storage.addBuildLog({
        projectId,
        level: "info",
        message: "Starting project analysis...",
      });

      // Get project directory (files should already be extracted during upload)
      const projectDir = await fileManager.getProjectDirectory(projectId);

      // Analyze project
      const analysis = await projectAnalyzer.analyzeProject(projectDir);

      // Update project with analysis results
      await storage.updateProject(projectId, {
        framework: analysis.framework,
        status: analysis.hasValidStructure ? "analyzed" : "error",
        progress: 50,
        buildConfig: analysis.buildConfig,
        projectStats: analysis.projectStats,
      });

      await storage.addBuildLog({
        projectId,
        level: analysis.hasValidStructure ? "info" : "error",
        message: `Analysis complete. Framework: ${analysis.framework}`,
      });

      if (analysis.errors.length > 0) {
        for (const error of analysis.errors) {
          await storage.addBuildLog({
            projectId,
            level: "error",
            message: error,
          });
        }
      }

      res.json({ analysis });
    } catch (error) {
      console.error("Analysis error:", error);
      await storage.updateProject(parseInt(req.params.id), {
        status: "error",
        progress: 0,
      });
      res.status(500).json({ error: "Analysis failed" });
    }
  });

  // Build APK
  app.post("/api/projects/:id/build", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const project = await storage.getProject(projectId);
      
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      // Update project status
      await storage.updateProject(projectId, {
        status: "building",
        progress: 60,
      });

      await storage.addBuildLog({
        projectId,
        level: "info",
        message: "Starting APK build...",
      });

      // Get project directory
      const projectDir = await fileManager.getProjectDirectory(projectId);
      
      // Re-analyze project to get latest analysis
      const analysis = await projectAnalyzer.analyzeProject(projectDir);

      // Build APK with progress callback
      const buildResult = await apkBuilder.buildApk(
        projectDir,
        analysis,
        async (progress, message) => {
          await storage.updateProject(projectId, { progress });
          await storage.addBuildLog({
            projectId,
            level: "info",
            message,
          });
        }
      );

      // Update project with build results
      if (buildResult.success) {
        await storage.updateProject(projectId, {
          status: "completed",
          progress: 100,
          apkPath: buildResult.apkPath,
          apkSize: buildResult.apkSize,
        });
      } else {
        await storage.updateProject(projectId, {
          status: "error",
          progress: 100,
        });
      }

      // Add build logs
      for (const log of buildResult.logs) {
        await storage.addBuildLog({
          projectId,
          level: "info",
          message: log,
        });
      }

      for (const error of buildResult.errors) {
        await storage.addBuildLog({
          projectId,
          level: "error",
          message: error,
        });
      }

      res.json({ buildResult });
    } catch (error) {
      console.error("Build error:", error);
      await storage.updateProject(parseInt(req.params.id), {
        status: "error",
        progress: 100,
      });
      res.status(500).json({ error: "Build failed" });
    }
  });

  // Download APK
  app.get("/api/projects/:id/download", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const project = await storage.getProject(projectId);
      
      if (!project || !project.apkPath) {
        return res.status(404).json({ error: "APK not found" });
      }

      const filename = `${project.name}-release.apk`;
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', 'application/vnd.android.package-archive');
      
      res.sendFile(path.resolve(project.apkPath));
    } catch (error) {
      console.error("Download error:", error);
      res.status(500).json({ error: "Download failed" });
    }
  });

  // Get build logs
  app.get("/api/projects/:id/logs", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const logs = await storage.getBuildLogs(projectId);
      res.json(logs);
    } catch (error) {
      console.error("Get logs error:", error);
      res.status(500).json({ error: "Failed to get logs" });
    }
  });

  // Clear build logs
  app.delete("/api/projects/:id/logs", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      await storage.clearBuildLogs(projectId);
      res.json({ success: true });
    } catch (error) {
      console.error("Clear logs error:", error);
      res.status(500).json({ error: "Failed to clear logs" });
    }
  });

  // Delete project
  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      
      // Clean up files
      const projectDir = await fileManager.getProjectDirectory(projectId);
      await fileManager.deleteDirectory(projectDir);
      
      // Delete from storage
      await storage.clearBuildLogs(projectId);
      await storage.deleteProject(projectId);
      
      res.json({ success: true });
    } catch (error) {
      console.error("Delete project error:", error);
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
