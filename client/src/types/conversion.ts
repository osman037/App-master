export interface Project {
  id: number;
  name: string;
  originalFileName: string;
  fileSize: number;
  framework?: string;
  status: 'uploaded' | 'analyzing' | 'analyzed' | 'building' | 'completed' | 'error';
  progress: number;
  buildConfig?: any;
  projectStats?: ProjectStats;
  logs?: any[];
  apkPath?: string;
  apkSize?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProjectStats {
  totalFiles: number;
  sourceFiles: number;
  dependencies: number;
  targetSdk?: number;
  minSdk?: number;
  buildTools?: string;
}

export interface BuildLog {
  id: number;
  projectId: number;
  level: 'info' | 'warning' | 'error';
  message: string;
  timestamp: Date;
}

export interface ConversionStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  icon: string;
  color: string;
}

export interface FileUploadState {
  file: File | null;
  uploading: boolean;
  progress: number;
  error: string | null;
}
