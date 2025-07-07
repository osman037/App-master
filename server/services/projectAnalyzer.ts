import path from 'path';
import { FileManager } from './fileManager';

export interface ProjectAnalysis {
  framework: string;
  language: string;
  projectType: string;
  hasValidStructure: boolean;
  missingFiles: string[];
  dependencies: string[];
  buildConfig: any;
  projectStats: {
    totalFiles: number;
    sourceFiles: number;
    dependencies: number;
    targetSdk?: number;
    minSdk?: number;
    buildTools?: string;
  };
  errors: string[];
}

export class ProjectAnalyzer {
  private fileManager: FileManager;

  constructor(fileManager: FileManager) {
    this.fileManager = fileManager;
  }

  async analyzeProject(projectPath: string): Promise<ProjectAnalysis> {
    const analysis: ProjectAnalysis = {
      framework: 'unknown',
      language: 'unknown',
      projectType: 'unknown',
      hasValidStructure: false,
      missingFiles: [],
      dependencies: [],
      buildConfig: {},
      projectStats: {
        totalFiles: 0,
        sourceFiles: 0,
        dependencies: 0,
      },
      errors: [],
    };

    try {
      // Get all files in the project
      const allFiles = await this.getAllFiles(projectPath);
      analysis.projectStats.totalFiles = allFiles.length;

      // Detect framework based on files
      const frameworkDetection = this.detectFramework(allFiles);
      analysis.framework = frameworkDetection.framework;
      analysis.language = frameworkDetection.language;
      analysis.projectType = frameworkDetection.projectType;

      // Analyze based on detected framework
      switch (analysis.framework) {
        case 'react-native':
          await this.analyzeReactNative(projectPath, allFiles, analysis);
          break;
        case 'flutter':
          await this.analyzeFlutter(projectPath, allFiles, analysis);
          break;
        case 'android':
          await this.analyzeAndroid(projectPath, allFiles, analysis);
          break;
        case 'cordova':
          await this.analyzeCordova(projectPath, allFiles, analysis);
          break;
        default:
          analysis.errors.push('Unsupported framework detected');
      }

      analysis.hasValidStructure = analysis.errors.length === 0;
    } catch (error) {
      analysis.errors.push(`Analysis failed: ${error.message}`);
    }

    return analysis;
  }

  private async getAllFiles(directory: string, relativePath = ''): Promise<string[]> {
    const files: string[] = [];
    const items = await this.fileManager.listFiles(path.join(directory, relativePath));

    for (const item of items) {
      const fullPath = path.join(directory, relativePath, item);
      const stats = await this.fileManager.getFileStats(fullPath);

      if (stats?.isDirectory) {
        const subFiles = await this.getAllFiles(directory, path.join(relativePath, item));
        files.push(...subFiles);
      } else {
        files.push(path.join(relativePath, item).replace(/\\/g, '/'));
      }
    }

    return files;
  }

  private detectFramework(files: string[]): { framework: string; language: string; projectType: string } {
    // React Native detection
    if (files.some(f => f.includes('package.json'))) {
      const hasReactNative = files.some(f => f.includes('react-native') || f.includes('metro.config'));
      if (hasReactNative) {
        return { framework: 'react-native', language: 'javascript', projectType: 'hybrid' };
      }
    }

    // Flutter detection
    if (files.some(f => f.includes('pubspec.yaml'))) {
      return { framework: 'flutter', language: 'dart', projectType: 'hybrid' };
    }

    // Android native detection
    if (files.some(f => f.includes('build.gradle') || f.includes('AndroidManifest.xml'))) {
      const hasKotlin = files.some(f => f.endsWith('.kt'));
      const hasJava = files.some(f => f.endsWith('.java'));
      const language = hasKotlin ? 'kotlin' : hasJava ? 'java' : 'unknown';
      return { framework: 'android', language, projectType: 'native' };
    }

    // Cordova detection
    if (files.some(f => f.includes('config.xml') && f.includes('www'))) {
      return { framework: 'cordova', language: 'javascript', projectType: 'hybrid' };
    }

    return { framework: 'unknown', language: 'unknown', projectType: 'unknown' };
  }

  private async analyzeReactNative(projectPath: string, files: string[], analysis: ProjectAnalysis): Promise<void> {
    // Check for essential files
    const requiredFiles = ['package.json', 'android/build.gradle', 'android/app/build.gradle'];
    analysis.missingFiles = requiredFiles.filter(file => !files.some(f => f.includes(file)));

    // Parse package.json
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (await this.fileManager.fileExists(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(await this.fileManager.readFile(packageJsonPath));
        analysis.dependencies = Object.keys(packageJson.dependencies || {});
        analysis.projectStats.dependencies = analysis.dependencies.length;
      } catch (error) {
        analysis.errors.push('Failed to parse package.json');
      }
    }

    // Parse Android gradle files
    const appGradlePath = path.join(projectPath, 'android/app/build.gradle');
    if (await this.fileManager.fileExists(appGradlePath)) {
      try {
        const gradleContent = await this.fileManager.readFile(appGradlePath);
        const targetSdk = this.extractGradleValue(gradleContent, 'targetSdkVersion');
        const minSdk = this.extractGradleValue(gradleContent, 'minSdkVersion');
        
        analysis.projectStats.targetSdk = targetSdk;
        analysis.projectStats.minSdk = minSdk;
        analysis.buildConfig = { targetSdk, minSdk };
      } catch (error) {
        analysis.errors.push('Failed to parse Android build.gradle');
      }
    }

    analysis.projectStats.sourceFiles = files.filter(f => f.endsWith('.js') || f.endsWith('.jsx') || f.endsWith('.ts') || f.endsWith('.tsx')).length;
  }

  private async analyzeFlutter(projectPath: string, files: string[], analysis: ProjectAnalysis): Promise<void> {
    // Check for essential files
    const requiredFiles = ['pubspec.yaml', 'android/build.gradle', 'lib/main.dart'];
    analysis.missingFiles = requiredFiles.filter(file => !files.some(f => f.includes(file)));

    // Parse pubspec.yaml
    const pubspecPath = path.join(projectPath, 'pubspec.yaml');
    if (await this.fileManager.fileExists(pubspecPath)) {
      try {
        const pubspecContent = await this.fileManager.readFile(pubspecPath);
        // Simple YAML parsing for dependencies
        const dependencyMatches = pubspecContent.match(/dependencies:\s*\n((?:\s+\S+:.*\n)*)/);
        if (dependencyMatches) {
          const deps = dependencyMatches[1].match(/^\s+(\S+):/gm);
          analysis.dependencies = deps ? deps.map(d => d.trim().replace(':', '')) : [];
          analysis.projectStats.dependencies = analysis.dependencies.length;
        }
      } catch (error) {
        analysis.errors.push('Failed to parse pubspec.yaml');
      }
    }

    analysis.projectStats.sourceFiles = files.filter(f => f.endsWith('.dart')).length;
  }

  private async analyzeAndroid(projectPath: string, files: string[], analysis: ProjectAnalysis): Promise<void> {
    // Check for essential files
    const requiredFiles = ['build.gradle', 'app/build.gradle', 'app/src/main/AndroidManifest.xml'];
    analysis.missingFiles = requiredFiles.filter(file => !files.some(f => f.includes(file)));

    // Parse build.gradle
    const appGradlePath = path.join(projectPath, 'app/build.gradle');
    if (await this.fileManager.fileExists(appGradlePath)) {
      try {
        const gradleContent = await this.fileManager.readFile(appGradlePath);
        const targetSdk = this.extractGradleValue(gradleContent, 'targetSdkVersion');
        const minSdk = this.extractGradleValue(gradleContent, 'minSdkVersion');
        
        analysis.projectStats.targetSdk = targetSdk;
        analysis.projectStats.minSdk = minSdk;
        analysis.buildConfig = { targetSdk, minSdk };
      } catch (error) {
        analysis.errors.push('Failed to parse build.gradle');
      }
    }

    analysis.projectStats.sourceFiles = files.filter(f => f.endsWith('.java') || f.endsWith('.kt')).length;
  }

  private async analyzeCordova(projectPath: string, files: string[], analysis: ProjectAnalysis): Promise<void> {
    // Check for essential files
    const requiredFiles = ['config.xml', 'www/index.html', 'platforms/android'];
    analysis.missingFiles = requiredFiles.filter(file => !files.some(f => f.includes(file)));

    // Parse config.xml
    const configPath = path.join(projectPath, 'config.xml');
    if (await this.fileManager.fileExists(configPath)) {
      try {
        const configContent = await this.fileManager.readFile(configPath);
        // Extract app info from config.xml
        const nameMatch = configContent.match(/<name>(.*?)<\/name>/);
        const versionMatch = configContent.match(/version="(.*?)"/);
        
        analysis.buildConfig = {
          appName: nameMatch ? nameMatch[1] : 'Unknown',
          version: versionMatch ? versionMatch[1] : '1.0.0'
        };
      } catch (error) {
        analysis.errors.push('Failed to parse config.xml');
      }
    }

    analysis.projectStats.sourceFiles = files.filter(f => f.endsWith('.js') || f.endsWith('.html') || f.endsWith('.css')).length;
  }

  private extractGradleValue(content: string, key: string): number | undefined {
    const regex = new RegExp(`${key}\\s+(\\d+)`);
    const match = content.match(regex);
    return match ? parseInt(match[1]) : undefined;
  }
}
