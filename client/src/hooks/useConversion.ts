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
    onSuccess: (data, variables, context) => {
      setCurrentProject(data.project);
      toast({
        title: 'Upload Successful',
        description: 'Your project has been uploaded successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      // Return the project so parent can use it
      return data.project;
    },
    onError: (error) => {
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
    onSuccess: () => {
      toast({
        title: 'Analysis Complete',
        description: 'Project analysis completed successfully.',
      });
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}`] });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: error.message || 'Failed to analyze project.',
      });
    },
  });

  // Build APK
  const buildMutation = useMutation({
    mutationFn: async (projectId: number) => {
      const response = await apiRequest('POST', `/api/projects/${projectId}/build`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Build Complete',
        description: 'APK has been generated successfully.',
      });
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}`] });
    },
    onError: (error) => {
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
  });

  // Get build logs
  const { data: logs, isLoading: logsLoading } = useQuery({
    queryKey: [`/api/projects/${projectId}/logs`],
    enabled: !!projectId,
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
    analyzeMutation.mutate(projectId);
  }, [analyzeMutation]);

  const buildApk = useCallback((projectId: number) => {
    buildMutation.mutate(projectId);
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
