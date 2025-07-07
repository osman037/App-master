import { useState, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Project, BuildLog } from '@/types/conversion';
import { toast } from '@/hooks/use-toast';

export const useConversion = (projectId?: number) => {
  const queryClient = useQueryClient();
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  // Upload project
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiRequest('POST', '/api/projects/upload', formData);
      return response.json();
    },
    onSuccess: (data) => {
      setCurrentProject(data.project);
      toast({
        title: 'Upload Successful',
        description: 'Project extracted successfully. Starting automatic analysis...',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      
      // Auto-start analysis if project was extracted
      if (data.project && data.project.status === 'extracted') {
        setTimeout(() => {
          analyzeMutation.mutate(data.project.id);
        }, 1000);
      }
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: error.message || 'Failed to upload project file.',
      });
    },
  });

  // Analyze project
  const analyzeMutation = useMutation({
    mutationFn: async (projectId: number) => {
      const response = await apiRequest('POST', `/api/projects/${projectId}/analyze`);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Analysis Complete',
        description: 'Project structure analyzed. Ready for APK generation.',
      });
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}`] });
      
      // Update current project with analysis results
      if (data.project) {
        setCurrentProject(data.project);
      }
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: error.message || 'Failed to analyze project.',
      });
    },
  });

  // Build APK
  const buildMutation = useMutation({
    mutationFn: async ({ projectId, keystoreData }: { projectId: number; keystoreData?: any }) => {
      const response = await apiRequest('POST', `/api/projects/${projectId}/build`, keystoreData);
      return response.json();
    },
    onSuccess: (data, variables) => {
      if (data.buildResult && data.buildResult.success) {
        toast({
          title: 'Build Complete',
          description: 'APK has been generated successfully.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Build Failed',
          description: data.buildResult?.errors?.join(', ') || 'Failed to build APK.',
        });
      }
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${variables.projectId}`] });
    },
    onError: (error: any) => {
      console.error('Build error:', error);
      toast({
        variant: 'destructive',
        title: 'Build Failed',
        description: error.message || 'Failed to build APK.',
      });
    },
  });

  // Get project details
  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: [`/api/projects/${projectId}`],
    enabled: !!projectId,
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });

  // Get build logs
  const { data: logs, isLoading: logsLoading } = useQuery({
    queryKey: [`/api/projects/${projectId}/logs`],
    enabled: !!projectId,
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });

  // Clear logs
  const clearLogsMutation = useMutation({
    mutationFn: async (projectId: number) => {
      await apiRequest('DELETE', `/api/projects/${projectId}/logs`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}/logs`] });
    },
  });

  // Delete project
  const deleteMutation = useMutation({
    mutationFn: async (projectId: number) => {
      await apiRequest('DELETE', `/api/projects/${projectId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      setCurrentProject(null);
    },
  });

  const uploadFile = useCallback((file: File) => {
    uploadMutation.mutate(file);
  }, [uploadMutation]);

  const analyzeProject = useCallback((projectId: number) => {
    // Prevent multiple concurrent analysis
    if (analyzeMutation.isPending) {
      return;
    }
    analyzeMutation.mutate(projectId);
  }, [analyzeMutation]);

  const buildApk = useCallback((projectId: number, keystoreData?: any) => {
    // Prevent multiple concurrent builds
    if (buildMutation.isPending) {
      return;
    }
    buildMutation.mutate({ projectId, keystoreData });
  }, [buildMutation]);

  const downloadApk = useCallback((projectId: number, filename: string) => {
    const link = document.createElement('a');
    link.href = `/api/projects/${projectId}/download`;
    link.download = filename;
    link.click();
  }, []);

  const clearLogs = useCallback((projectId: number) => {
    clearLogsMutation.mutate(projectId);
  }, [clearLogsMutation]);

  const deleteProject = useCallback((projectId: number) => {
    deleteMutation.mutate(projectId);
  }, [deleteMutation]);

  return {
    // State
    currentProject: project || currentProject,
    logs: logs || [],
    
    // Loading states
    uploading: uploadMutation.isPending,
    analyzing: analyzeMutation.isPending,
    building: buildMutation.isPending,
    projectLoading,
    logsLoading,
    
    // Actions
    uploadFile,
    analyzeProject,
    buildApk,
    downloadApk,
    clearLogs,
    deleteProject,
  };
};
