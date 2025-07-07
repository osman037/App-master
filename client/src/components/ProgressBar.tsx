import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Project } from '@/types/conversion';

interface ProgressBarProps {
  project: Project | null;
}

export function ProgressBar({ project }: ProgressBarProps) {
  const progress = project?.progress || 0;
  const status = project?.status || 'uploaded';
  
  const getStatusMessage = () => {
    if (!project) return 'Waiting for file upload...';
    
    switch (status) {
      case 'uploaded':
        return 'Project uploaded successfully...';
      case 'extracted':
        return 'Project extracted successfully. Ready for analysis.';
      case 'analyzing':
        return 'Analyzing project structure and dependencies...';
      case 'analyzed':
        return 'Analysis complete. Ready for build.';
      case 'building':
        return 'Building APK file...';
      case 'completed':
        return 'APK generation completed successfully!';
      case 'error':
        return 'An error occurred during the process.';
      default:
        return 'Processing...';
    }
  };

  const getProgressColor = () => {
    if (status === 'error') return 'bg-red-600';
    if (status === 'completed') return 'bg-green-600';
    return 'bg-blue-600';
  };

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900">Conversion Progress</h3>
          <span className="text-sm text-slate-500">{progress}% Complete</span>
        </div>
        
        <div className="w-full bg-slate-200 rounded-full h-3 mb-4">
          <div 
            className={`h-3 rounded-full transition-all duration-300 ${getProgressColor()}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="p-4 bg-slate-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className={`w-4 h-4 rounded-full ${
              status === 'error' ? 'bg-red-300' : 
              status === 'completed' ? 'bg-green-300' : 
              'bg-blue-300'
            }`} />
            <span className="text-sm text-slate-600">{getStatusMessage()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
