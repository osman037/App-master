import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Download, Share, Plus } from 'lucide-react';
import { Project } from '@/types/conversion';

interface SuccessPanelProps {
  project: Project;
  onDownload: () => void;
  onShare: () => void;
  onNewProject: () => void;
}

export function SuccessPanel({ project, onDownload, onShare, onNewProject }: SuccessPanelProps) {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const calculateBuildTime = () => {
    if (!project.createdAt || !project.updatedAt) return 'N/A';
    const start = new Date(project.createdAt);
    const end = new Date(project.updatedAt);
    const diff = end.getTime() - start.getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  return (
    <Card className="bg-green-50 border-green-200">
      <CardContent className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="text-green-600 w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-900">Conversion Complete!</h3>
            <p className="text-green-700">Your APK file has been generated successfully.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-white p-4 rounded-lg border border-green-200">
            <h4 className="font-medium text-slate-900 mb-2">APK Details</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">File Name:</span>
                <span className="font-medium">{project.name}-release.apk</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Size:</span>
                <span className="font-medium">{formatFileSize(project.apkSize || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Version:</span>
                <span className="font-medium">1.0.0</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-green-200">
            <h4 className="font-medium text-slate-900 mb-2">Build Summary</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Build Time:</span>
                <span className="font-medium">{calculateBuildTime()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Framework:</span>
                <span className="font-medium">{project.framework || 'Unknown'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Status:</span>
                <span className="font-medium text-green-600">Success</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button 
            className="bg-green-600 hover:bg-green-700" 
            onClick={onDownload}
          >
            <Download className="w-4 h-4 mr-2" />
            Download APK
          </Button>
          
          <Button 
            className="bg-slate-600 hover:bg-slate-700" 
            onClick={onShare}
          >
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
          
          <Button 
            variant="outline" 
            className="border-slate-300 hover:bg-slate-50" 
            onClick={onNewProject}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
