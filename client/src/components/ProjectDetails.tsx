import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Code, Settings, BarChart3 } from 'lucide-react';
import { Project } from '@/types/conversion';

interface ProjectDetailsProps {
  project: Project | null;
  onRefresh: () => void;
}

export function ProjectDetails({ project, onRefresh }: ProjectDetailsProps) {
  const getFrameworkIcon = (framework: string) => {
    switch (framework?.toLowerCase()) {
      case 'react-native':
        return '⚛️';
      case 'flutter':
        return '🦋';
      case 'android':
        return '🤖';
      case 'cordova':
        return '📱';
      default:
        return '❓';
    }
  };

  const getFrameworkBadge = (framework: string) => {
    switch (framework?.toLowerCase()) {
      case 'react-native':
        return <Badge className="bg-blue-100 text-blue-800">React Native</Badge>;
      case 'flutter':
        return <Badge className="bg-blue-100 text-blue-800">Flutter</Badge>;
      case 'android':
        return <Badge className="bg-green-100 text-green-800">Android</Badge>;
      case 'cordova':
        return <Badge className="bg-orange-100 text-orange-800">Cordova</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-slate-900">Project Details</h3>
          <Button variant="ghost" size="sm" onClick={onRefresh}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Framework Info */}
          <div className="space-y-3">
            <h4 className="font-medium text-slate-900">Framework</h4>
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Code className="text-blue-600 w-5 h-5" />
              </div>
              <div>
                {project?.framework ? (
                  <>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getFrameworkIcon(project.framework)}</span>
                      {getFrameworkBadge(project.framework)}
                    </div>
                    <p className="text-sm text-slate-500 mt-1">
                      {project.framework.charAt(0).toUpperCase() + project.framework.slice(1)} Project
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-medium text-slate-900">Not Detected</p>
                    <p className="text-sm text-slate-500">Upload a project to detect</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Build Info */}
          <div className="space-y-3">
            <h4 className="font-medium text-slate-900">Build Configuration</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Target SDK</span>
                <span className="text-sm font-medium text-slate-900">
                  {project?.projectStats?.targetSdk || '-'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Min SDK</span>
                <span className="text-sm font-medium text-slate-900">
                  {project?.projectStats?.minSdk || '-'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Build Tools</span>
                <span className="text-sm font-medium text-slate-900">
                  {project?.projectStats?.buildTools || '-'}
                </span>
              </div>
            </div>
          </div>

          {/* File Statistics */}
          <div className="space-y-3">
            <h4 className="font-medium text-slate-900">Project Statistics</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Total Files</span>
                <span className="text-sm font-medium text-slate-900">
                  {project?.projectStats?.totalFiles || '-'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Source Files</span>
                <span className="text-sm font-medium text-slate-900">
                  {project?.projectStats?.sourceFiles || '-'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Dependencies</span>
                <span className="text-sm font-medium text-slate-900">
                  {project?.projectStats?.dependencies || '-'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
