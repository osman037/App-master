import { spawn } from 'child_process';
import path from 'path';
import { FileManager } from './fileManager';
import { ProjectAnalysis } from './projectAnalyzer';

export interface BuildResult {
  success: boolean;
  apkPath?: string;
  apkSize?: number;
  errors: string[];
  logs: string[];
}

export class ApkBuilder {
  private fileManager: FileManager;

  constructor(fileManager: FileManager) {
    this.fileManager = fileManager;
  }

  async buildApk(projectPath: string, analysis: ProjectAnalysis, onProgress?: (progress: number, message: string) => void): Promise<BuildResult> {
    const result: BuildResult = {
      success: false,
      errors: [],
      logs: [],
    };

    try {
      onProgress?.(10, 'Starting APK build process...');
      
      // Create missing files and directories
      await this.createMissingFiles(projectPath, analysis);
      onProgress?.(30, 'Created missing files...');

      // Install dependencies
      await this.installDependencies(projectPath, analysis);
      onProgress?.(50, 'Installed dependencies...');

      // Build APK based on framework
      const buildResult = await this.buildByFramework(projectPath, analysis);
      result.logs.push(...buildResult.logs);
      
      if (buildResult.success) {
        result.success = true;
        result.apkPath = buildResult.apkPath;
        result.apkSize = buildResult.apkSize;
        onProgress?.(100, 'APK build completed successfully!');
      } else {
        result.errors.push(...buildResult.errors);
        onProgress?.(100, 'APK build failed');
      }
    } catch (error) {
      result.errors.push(`Build failed: ${error.message}`);
      onProgress?.(100, 'Build process failed');
    }

    return result;
  }

  private async createMissingFiles(projectPath: string, analysis: ProjectAnalysis): Promise<void> {
    for (const missingFile of analysis.missingFiles) {
      const filePath = path.join(projectPath, missingFile);
      
      // Create directory if it doesn't exist
      const dir = path.dirname(filePath);
      await this.fileManager.ensureDirectory(dir);

      // Create file based on type
      if (missingFile.includes('AndroidManifest.xml')) {
        await this.createAndroidManifest(filePath, analysis);
      } else if (missingFile.includes('build.gradle')) {
        await this.createBuildGradle(filePath, analysis);
      } else if (missingFile.includes('package.json')) {
        await this.createPackageJson(filePath, analysis);
      } else if (missingFile.includes('config.xml')) {
        await this.createConfigXml(filePath, analysis);
      }
    }
  }

  private async createAndroidManifest(filePath: string, analysis: ProjectAnalysis): Promise<void> {
    const manifest = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.app">
    
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:theme="@style/AppTheme">
        
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;
    
    await this.fileManager.writeFile(filePath, manifest);
  }

  private async createBuildGradle(filePath: string, analysis: ProjectAnalysis): Promise<void> {
    const isAppLevel = filePath.includes('app/build.gradle');
    
    let gradle = '';
    if (isAppLevel) {
      gradle = `android {
    compileSdkVersion ${analysis.projectStats.targetSdk || 33}
    
    defaultConfig {
        applicationId "com.example.app"
        minSdkVersion ${analysis.projectStats.minSdk || 21}
        targetSdkVersion ${analysis.projectStats.targetSdk || 33}
        versionCode 1
        versionName "1.0"
    }
    
    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}

dependencies {
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.9.0'
    implementation 'androidx.constraintlayout:constraintlayout:2.1.4'
}`;
    } else {
      gradle = `buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:7.4.2'
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}`;
    }
    
    await this.fileManager.writeFile(filePath, gradle);
  }

  private async createPackageJson(filePath: string, analysis: ProjectAnalysis): Promise<void> {
    const packageJson = {
      name: "mobile-app",
      version: "1.0.0",
      main: "index.js",
      scripts: {
        "android": "react-native run-android",
        "ios": "react-native run-ios",
        "start": "react-native start"
      },
      dependencies: {
        "react": "18.2.0",
        "react-native": "0.72.0"
      }
    };
    
    await this.fileManager.writeFile(filePath, JSON.stringify(packageJson, null, 2));
  }

  private async createConfigXml(filePath: string, analysis: ProjectAnalysis): Promise<void> {
    const config = `<?xml version='1.0' encoding='utf-8'?>
<widget id="com.example.app" version="1.0.0" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">
    <name>Mobile App</name>
    <description>
        A sample Apache Cordova application.
    </description>
    <content src="index.html" />
    <access origin="*" />
    <allow-intent href="http://*/*" />
    <allow-intent href="https://*/*" />
    <platform name="android">
        <allow-intent href="market:*" />
    </platform>
</widget>`;
    
    await this.fileManager.writeFile(filePath, config);
  }

  private async installDependencies(projectPath: string, analysis: ProjectAnalysis): Promise<void> {
    if (analysis.framework === 'react-native') {
      await this.runCommand('npm', ['install'], projectPath);
    } else if (analysis.framework === 'flutter') {
      await this.runCommand('flutter', ['pub', 'get'], projectPath);
    } else if (analysis.framework === 'cordova') {
      await this.runCommand('cordova', ['prepare'], projectPath);
    }
  }

  private async buildByFramework(projectPath: string, analysis: ProjectAnalysis): Promise<BuildResult> {
    const result: BuildResult = {
      success: false,
      errors: [],
      logs: [],
    };

    try {
      let apkPath: string;
      
      switch (analysis.framework) {
        case 'react-native':
          apkPath = await this.buildReactNative(projectPath);
          break;
        case 'flutter':
          apkPath = await this.buildFlutter(projectPath);
          break;
        case 'android':
          apkPath = await this.buildAndroid(projectPath);
          break;
        case 'cordova':
          apkPath = await this.buildCordova(projectPath);
          break;
        default:
          throw new Error(`Unsupported framework: ${analysis.framework}`);
      }

      // Verify APK exists and get size
      if (await this.fileManager.fileExists(apkPath)) {
        const stats = await this.fileManager.getFileStats(apkPath);
        result.success = true;
        result.apkPath = apkPath;
        result.apkSize = stats?.size;
        result.logs.push(`APK built successfully: ${apkPath}`);
      } else {
        result.errors.push('APK file not found after build');
      }
    } catch (error) {
      result.errors.push(`Build failed: ${error.message}`);
    }

    return result;
  }

  private async buildReactNative(projectPath: string): Promise<string> {
    await this.runCommand('npx', ['react-native', 'run-android', '--variant=release'], projectPath);
    return path.join(projectPath, 'android/app/build/outputs/apk/release/app-release.apk');
  }

  private async buildFlutter(projectPath: string): Promise<string> {
    await this.runCommand('flutter', ['build', 'apk', '--release'], projectPath);
    return path.join(projectPath, 'build/app/outputs/flutter-apk/app-release.apk');
  }

  private async buildAndroid(projectPath: string): Promise<string> {
    await this.runCommand('./gradlew', ['assembleRelease'], projectPath);
    return path.join(projectPath, 'app/build/outputs/apk/release/app-release.apk');
  }

  private async buildCordova(projectPath: string): Promise<string> {
    await this.runCommand('cordova', ['build', 'android', '--release'], projectPath);
    return path.join(projectPath, 'platforms/android/app/build/outputs/apk/release/app-release.apk');
  }

  private async runCommand(command: string, args: string[], cwd: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, { cwd, shell: true });
      let output = '';
      let errorOutput = '';

      child.stdout?.on('data', (data) => {
        output += data.toString();
      });

      child.stderr?.on('data', (data) => {
        errorOutput += data.toString();
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve(output);
        } else {
          reject(new Error(`Command failed with code ${code}: ${errorOutput}`));
        }
      });

      child.on('error', (error) => {
        reject(error);
      });
    });
  }
}
