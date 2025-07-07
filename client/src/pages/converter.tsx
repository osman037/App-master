import { useState, useEffect } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { ProcessingSteps } from '@/components/ProcessingSteps';
import { ProgressBar } from '@/components/ProgressBar';
import { ProjectDetails } from '@/components/ProjectDetails';
import { BuildLog } from '@/components/BuildLog';
import { ActionButtons } from '@/components/ActionButtons';
import { SuccessPanel } from '@/components/SuccessPanel';
import { Smartphone } from 'lucide-react';
import { useConversion } from '@/hooks/useConversion';

export default function Converter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [projectId, setProjectId] = useState<number | undefined>(undefined);
  const {
    currentProject,
    logs,
    uploading,
    analyzing,
    building,
    uploadFile,
    analyzeProject,
    buildApk,
    downloadApk,
    clearLogs,
    deleteProject,
  } = useConversion(projectId);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    uploadFile(file);
  };

  // Update projectId when currentProject changes
  useEffect(() => {
    if (currentProject?.id) {
      setProjectId(currentProject.id);
    }
  }, [currentProject?.id]);

  const handleFileRemove = () => {
    setSelectedFile(null);
  };

  const handleStartConversion = () => {
    if (currentProject) {
      analyzeProject(currentProject.id);
    }
  };

  const handlePause = () => {
    // TODO: Implement pause functionality
    console.log('Pause conversion');
  };

  const handleStop = () => {
    // TODO: Implement stop functionality
    console.log('Stop conversion');
  };

  const handleDownload = () => {
    if (currentProject) {
      downloadApk(currentProject.id, `${currentProject.name}-release.apk`);
    }
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log('Share APK');
  };

  const handleNewProject = () => {
    if (currentProject) {
      deleteProject(currentProject.id);
    }
    setSelectedFile(null);
  };

  const handleRefresh = () => {
    // Data will be refreshed automatically via React Query
    console.log('Refresh project details');
  };

  const handleExportLogs = () => {
    const logData = logs.map(log => `[${log.timestamp}] ${log.level.toUpperCase()}: ${log.message}`).join('\n');
    const blob = new Blob([logData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `build-logs-${currentProject?.id || 'unknown'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearLogs = () => {
    if (currentProject) {
      clearLogs(currentProject.id);
    }
  };

  // Auto-start build after analysis
  useEffect(() => {
    if (currentProject?.status === 'analyzed') {
      buildApk(currentProject.id);
    }
  }, [currentProject?.status, buildApk]);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Smartphone className="text-white w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">APK Converter Pro</h1>
                <p className="text-sm text-slate-500">Mobile App to APK Conversion Tool</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-500">v2.1.0</span>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-600 font-medium">Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Upload Section */}
        <div className="mb-8">
          <FileUpload
            onFileSelect={handleFileSelect}
            uploading={uploading}
            selectedFile={selectedFile}
            onFileRemove={handleFileRemove}
          />
        </div>

        {/* Processing Steps */}
        <div className="mb-8">
          <ProcessingSteps project={currentProject} />
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <ProgressBar project={currentProject} />
        </div>

        {/* Project Details */}
        <div className="mb-8">
          <ProjectDetails project={currentProject} onRefresh={handleRefresh} />
        </div>

        {/* Build Log */}
        <div className="mb-8">
          <BuildLog
            logs={logs}
            onClear={handleClearLogs}
            onExport={handleExportLogs}
          />
        </div>

        {/* Action Buttons */}
        <div className="mb-8">
          <ActionButtons
            project={currentProject}
            onStart={handleStartConversion}
            onPause={handlePause}
            onStop={handleStop}
            onDownload={handleDownload}
            analyzing={analyzing}
            building={building}
          />
        </div>

        {/* Success Panel */}
        {currentProject?.status === 'completed' && (
          <div className="mb-8">
            <SuccessPanel
              project={currentProject}
              onDownload={handleDownload}
              onShare={handleShare}
              onNewProject={handleNewProject}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Supported Frameworks</h3>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center space-x-2">
                  <span>⚛️</span>
                  <span>React Native</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🦋</span>
                  <span>Flutter</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🤖</span>
                  <span>Java/Kotlin</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>📱</span>
                  <span>Cordova/PhoneGap</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Features</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Automatic language detection</li>
                <li>• Project structure analysis</li>
                <li>• Missing file creation</li>
                <li>• Dependency management</li>
                <li>• Release APK generation</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Help & Support</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-blue-600">Documentation</a></li>
                <li><a href="#" className="hover:text-blue-600">API Reference</a></li>
                <li><a href="#" className="hover:text-blue-600">Community Forum</a></li>
                <li><a href="#" className="hover:text-blue-600">Contact Support</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-200 mt-8 pt-6 text-center text-sm text-slate-500">
            <p>&copy; 2024 APK Converter Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
