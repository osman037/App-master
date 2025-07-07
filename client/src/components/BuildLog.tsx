import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download, X } from 'lucide-react';
import { BuildLog as BuildLogType } from '@/types/conversion';

interface BuildLogProps {
  logs: BuildLogType[];
  onClear: () => void;
  onExport: () => void;
}

export function BuildLog({ logs, onClear, onExport }: BuildLogProps) {
  const formatTimestamp = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getLogColor = (level: string) => {
    switch (level) {
      case 'info':
        return 'text-blue-400';
      case 'warning':
        return 'text-yellow-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-slate-300';
    }
  };

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900">Build Log</h3>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={onExport}>
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
            <Button variant="ghost" size="sm" onClick={onClear}>
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          </div>
        </div>
        
        <div className="bg-slate-900 rounded-lg p-4 h-64">
          <ScrollArea className="h-full">
            <div className="font-mono text-sm text-slate-300 space-y-1">
              {logs.length === 0 ? (
                <div className="flex items-center space-x-2">
                  <span className="text-slate-500">[00:00:00]</span>
                  <span className="text-slate-400">INFO</span>
                  <span>APK Converter Pro v2.1.0 initialized</span>
                </div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="flex items-center space-x-2">
                    <span className="text-slate-500">[{formatTimestamp(log.timestamp)}]</span>
                    <span className={`uppercase ${getLogColor(log.level)}`}>{log.level}</span>
                    <span>{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
