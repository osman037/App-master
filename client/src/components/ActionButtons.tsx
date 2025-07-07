import { Button } from '@/components/ui/button';
import { Play, Pause, Square, Download } from 'lucide-react';
import { Project } from '@/types/conversion';

interface ActionButtonsProps {
  project: Project | null;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  onDownload: () => void;
  analyzing: boolean;
  building: boolean;
}

export function ActionButtons({ 
  project, 
  onStart, 
  onPause, 
  onStop, 
  onDownload, 
  analyzing, 
  building 
}: ActionButtonsProps) {
  const canStart = project && project.status === 'analyzed' && !analyzing && !building;
  const canPause = project && (analyzing || building);
  const canStop = project && (analyzing || building);
  const canDownload = project && project.status === 'completed' && project.apkPath;

  return (
    <div className="flex items-center justify-between space-x-4">
      <div className="flex items-center space-x-3">
        <Button 
          className="bg-blue-600 hover:bg-blue-700" 
          onClick={onStart}
          disabled={!canStart}
        >
          <Play className="w-4 h-4 mr-2" />
          Generate APK
        </Button>
        
        <Button 
          className="bg-slate-600 hover:bg-slate-700" 
          onClick={onPause}
          disabled={!canPause}
        >
          <Pause className="w-4 h-4 mr-2" />
          Pause
        </Button>
        
        <Button 
          className="bg-red-600 hover:bg-red-700" 
          onClick={onStop}
          disabled={!canStop}
        >
          <Square className="w-4 h-4 mr-2" />
          Stop
        </Button>
      </div>
      
      <div className="flex items-center space-x-3">
        <Button 
          className="bg-green-600 hover:bg-green-700" 
          onClick={onDownload}
          disabled={!canDownload}
        >
          <Download className="w-4 h-4 mr-2" />
          Download APK
        </Button>
      </div>
    </div>
  );
}
