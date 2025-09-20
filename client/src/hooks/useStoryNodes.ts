import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { EnhancedStoryNodeData } from '@shared/schema';

export function useProjectNodes(projectId: string | null) {
  return useQuery({
    queryKey: ['/api/projects', projectId, 'nodes'],
    enabled: !!projectId,
  });
}

export function useCreateNode() {
  return useMutation({
    mutationFn: async ({ projectId, ...nodeData }: { projectId: string } & Omit<EnhancedStoryNodeData, 'id'>) => {
      const response = await apiRequest('POST', `/api/projects/${projectId}/nodes`, nodeData);
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['/api/projects', variables.projectId, 'nodes'] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['/api/projects', variables.projectId] 
      });
    },
  });
}

export function useUpdateNode() {
  return useMutation({
    mutationFn: async ({ projectId, nodeId, ...updates }: { projectId: string; nodeId: string } & Partial<EnhancedStoryNodeData>) => {
      const response = await apiRequest('PUT', `/api/projects/${projectId}/nodes/${nodeId}`, updates);
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['/api/projects', variables.projectId, 'nodes'] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['/api/projects', variables.projectId] 
      });
    },
  });
}

export function useDeleteNode() {
  return useMutation({
    mutationFn: ({ projectId, nodeId }: { projectId: string; nodeId: string }) =>
      apiRequest('DELETE', `/api/projects/${projectId}/nodes/${nodeId}`),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['/api/projects', variables.projectId, 'nodes'] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['/api/projects', variables.projectId] 
      });
    },
  });
}