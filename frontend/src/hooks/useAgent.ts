import { useQuery } from '@tanstack/react-query';
import { agentService } from '../services/agentService';
import type {
  PublicAgentDetail,
  PublicAgentSummary,
  PublicDirectoryQueryParams,
} from '../types/agent';
import type { ApiError } from '../services/api';

/**
 * React Query hook to retrieve an individual public agent by slug.
 */
export function usePublicAgent(slug: string | undefined) {
  return useQuery<PublicAgentDetail, ApiError>({
    queryKey: ['agent', slug?.toLowerCase()],
    queryFn: () => {
      if (!slug) {
        throw new Error('Agent slug parameter is required');
      }
      return agentService.fetchPublicAgent(slug);
    },
    enabled: Boolean(slug && slug.trim().length > 0),
    retry: (failureCount, error) => {
      // Never retry 404s (agent not found or unpublished)
      if (error?.status === 404) return false;
      return failureCount < 2;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes fresh
  });
}

/**
 * React Query hook to retrieve the public agents directory.
 */
export function usePublicDirectory(params: PublicDirectoryQueryParams = {}) {
  return useQuery<PublicAgentSummary[], ApiError>({
    queryKey: ['agents-directory', params],
    queryFn: () => agentService.fetchPublicDirectory(params),
    staleTime: 1000 * 60 * 2, // 2 minutes fresh
  });
}

