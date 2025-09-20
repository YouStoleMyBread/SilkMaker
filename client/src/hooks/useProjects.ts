import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { ProjectData } from '@shared/schema';

export function useProjects() {
  return useQuery({
    queryKey: ['/api/projects'],
  });
}

export function useProject(projectId: string | null) {
  return useQuery({
    queryKey: ['/api/projects', projectId],
    enabled: !!projectId,
  });
}

export function useCreateProject() {
  return useMutation({
    mutationFn: async (projectData: { name: string; description?: string }) => {
      const response = await apiRequest('POST', '/api/projects', projectData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
    },
  });
}

export function useUpdateProject() {
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<ProjectData>) => {
      const response = await apiRequest('PUT', `/api/projects/${id}`, data);
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      queryClient.invalidateQueries({ queryKey: ['/api/projects', variables.id] });
    },
  });
}

export function useDeleteProject() {
  return useMutation({
    mutationFn: (projectId: string) =>
      apiRequest('DELETE', `/api/projects/${projectId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
    },
  });
}

export function useExportProject() {
  return useMutation({
    mutationFn: async (projectId: string) => {
      const response = await fetch(`/api/projects/${projectId}/export`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Export failed');
      }
      
      const blob = await response.blob();
      const filename = response.headers.get('Content-Disposition')?.split('filename=')[1]?.replace(/"/g, '') || 'story.html';
      
      // Download the file
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      return filename;
    },
  });
}