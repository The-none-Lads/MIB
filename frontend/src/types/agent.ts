/**
 * MIB Public Agent Types
 * Strict correspondence with backend Pydantic schemas in `backend/app/schemas/agent.py`.
 * 
 * SECURITY INVARIANT:
 * real_name and internal administrative identifiers are strictly prohibited in public types.
 */

export interface PublicAgentSummary {
  slug: string;
  codename: string;
  agent_number: string;
  rank: string;
  division: string;
  clearance_level: string;
  status: string;
  photograph_url?: string | null;
  specialization?: string | null;
  recruitment_date?: string | null;
}

export interface PublicAgentDetail {
  slug: string;
  codename: string;
  agent_number: string;
  rank: string;
  division: string;
  clearance_level: string;
  status: string;
  photograph_url?: string | null;
  specialization?: string | null;
  biography?: string | null;
  signature_quote?: string | null;
  recruitment_date?: string | null;
  created_at: string;
}

export interface PublicDirectoryQueryParams {
  query?: string;
  rank?: string;
  division?: string;
  status?: string;
  skip?: number;
  limit?: number;
}

export interface ApiErrorResponse {
  detail: string;
  status?: number;
}

