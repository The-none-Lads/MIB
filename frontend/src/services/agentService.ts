import { apiClient } from './api';
import type {
  PublicAgentDetail,
  PublicAgentSummary,
  PublicDirectoryQueryParams,
} from '../types/agent';

/**
 * Service for querying public agent endpoints.
 */
export const agentService = {
  /**
   * Retrieve an agent profile by slug.
   * Throws ApiError with status 404 if agent does not exist or is unpublished.
   */
  async fetchPublicAgent(slug: string): Promise<PublicAgentDetail> {
    const cleanSlug = encodeURIComponent(slug.trim().toLowerCase());
    return apiClient<PublicAgentDetail>(`/agents/${cleanSlug}`);
  },

  /**
   * Retrieve the list of active agents published in the public directory.
   */
  async fetchPublicDirectory(
    params: PublicDirectoryQueryParams = {}
  ): Promise<PublicAgentSummary[]> {
    const searchParams = new URLSearchParams();

    if (params.query) searchParams.append('query', params.query);
    if (params.rank) searchParams.append('rank', params.rank);
    if (params.division) searchParams.append('division', params.division);
    if (params.status) searchParams.append('status', params.status);
    if (params.skip !== undefined) searchParams.append('skip', String(params.skip));
    if (params.limit !== undefined) searchParams.append('limit', String(params.limit));

    const queryString = searchParams.toString();
    const endpoint = `/agents${queryString ? `?${queryString}` : ''}`;

    return apiClient<PublicAgentSummary[]>(endpoint);
  },
};

