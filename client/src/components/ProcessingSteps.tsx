import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Settings, Hammer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Project } from '@/types/conversion';

interface ProcessingStepsProps {
  project: Project | null;
}

export function ProcessingSteps({ project }: ProcessingStepsProps) {
  const getStepStatus = (step: string) => {
    if (!project) return 'pending';
    
    switch (step) {
      case 'analysis':
        if (project.status === 'analyzing') return 'processing';
        if (project.status === 'analyzed' || project.status === 'building' || project.status === 'completed') return 'completed';
        if (project.status === 'error') return 'error';
        return 'pending';
      
      case 'setup':
        if (project.status === 'building') return 'processing';
        if (project.status === 'completed') return 'completed';
        if (project.status === 'error' && project.progress > 50) return 'error';
        return 'pending';
      
      case 'build':
        if (project.status === 'building' && project.progress > 60) return 'processing';
        if (project.status === 'completed') return 'completed';
        if (project.status === 'error' && project.progress > 60) return 'error';
        return 'pending';
      
      default:
        return 'pending';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const steps = [
    {
      id: 'analysis',
      title: 'Project Analysis',
      description: 'Detecting framework & structure',
      icon: Search,
      color: 'blue',
      number: 1,
      substeps: [
        { name: 'Language Detection', key: 'language' },
        { name: 'File Structure', key: 'structure' },
        { name: 'Dependencies', key: 'dependencies' },
      ],
    },
    {
      id: 'setup',
      title: 'Project Setup',
      description: 'Installing dependencies',
      icon: Settings,
      color: 'amber',
      number: 2,
      substeps: [
        { name: 'Missing Files', key: 'files' },
        { name: 'SDK Setup', key: 'sdk' },
        { name: 'Build Tools', key: 'tools' },
      ],
    },
    {
      id: 'build',
      title: 'APK Generation',
      description: 'Building release APK',
      icon: Hammer,
      color: 'green',
      number: 3,
      substeps: [
        { name: 'Pre-build Check', key: 'precheck' },
        { name: 'APK Compilation', key: 'compile' },
        { name: 'Final Verification', key: 'verify' },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {steps.map((step) => {
        const status = getStepStatus(step.id);
        const IconComponent = step.icon;
        
        return (
          <Card key={step.id} className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    step.color === 'blue' && "bg-blue-100",
                    step.color === 'amber' && "bg-amber-100",
                    step.color === 'green' && "bg-green-100"
                  )}>
                    <IconComponent className={cn(
                      "w-5 h-5",
                      step.color === 'blue' && "text-blue-600",
                      step.color === 'amber' && "text-amber-600",
                      step.color === 'green' && "text-green-600"
                    )} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{step.title}</h3>
                    <p className="text-sm text-slate-500">{step.description}</p>
                  </div>
                </div>
                <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-slate-600">{step.number}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                {step.substeps.map((substep) => (
                  <div key={substep.key} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">{substep.name}</span>
                    {getStatusBadge(status)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
