import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePublicDirectory } from '../../hooks/useAgent';
import { Search, Filter, Shield, ChevronRight, UserX, Terminal, Sparkles } from 'lucide-react';
import type { PublicDirectoryQueryParams } from '../../types/agent';

export const DirectoryPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRank, setSelectedRank] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');

  const queryParams: PublicDirectoryQueryParams = {
    query: searchQuery.trim() || undefined,
    rank: selectedRank || undefined,
    division: selectedDivision || undefined,
    status: 'active',
  };

  const { data: agents, isLoading, isError, error } = usePublicDirectory(queryParams);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="border-b border-mib-charcoal-800 pb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-mib-cyan-400 mb-1">
              <span className="w-2 h-2 rounded-full bg-mib-cyan-400 animate-pulse" />
              <span>CLEARANCE: LEVEL 9 DIRECTORY REGISTRY</span>
            </div>
            <h1 className="text-3xl font-display font-extrabold text-white tracking-wide">
              PERSONNEL DIRECTORY
            </h1>
            <p className="text-xs font-mono text-mib-silver-400 mt-1">
              Active extraterrestrial investigation operatives and field supervisors.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono text-mib-silver-400">
            <span className="px-3 py-1.5 rounded bg-mib-charcoal-800 border border-mib-charcoal-700">
              {agents ? `${agents.length} OPERATIVE(S) ONLINE` : 'CONNECTING...'}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-mib-obsidian-900 border border-mib-charcoal-700/80 shadow-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search Input */}
          <div className="relative md:col-span-1">
            <Search className="w-4 h-4 text-mib-silver-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search codename or agent ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-mib-obsidian-950 border border-mib-charcoal-700 text-xs font-mono text-mib-silver-200 placeholder-mib-silver-500 focus:outline-none focus:border-mib-cyan-500 transition-colors"
            />
          </div>

          {/* Rank Filter */}
          <div className="relative">
            <Filter className="w-4 h-4 text-mib-silver-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <select
              value={selectedRank}
              onChange={(e) => setSelectedRank(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-lg bg-mib-obsidian-950 border border-mib-charcoal-700 text-xs font-mono text-mib-silver-200 focus:outline-none focus:border-mib-cyan-500 transition-colors appearance-none cursor-pointer"
            >
              <option value="">All Ranks</option>
              <option value="Senior Special Agent">Senior Special Agent</option>
              <option value="Special Agent">Special Agent</option>
              <option value="Field Operative">Field Operative</option>
              <option value="Director">Director</option>
            </select>
          </div>

          {/* Division Filter */}
          <div className="relative">
            <select
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-mib-obsidian-950 border border-mib-charcoal-700 text-xs font-mono text-mib-silver-200 focus:outline-none focus:border-mib-cyan-500 transition-colors appearance-none cursor-pointer"
            >
              <option value="">All Operational Divisions</option>
              <option value="Interstellar Infiltration">Interstellar Infiltration</option>
              <option value="Extraterrestrial Immigration">Extraterrestrial Immigration</option>
              <option value="Neural Oversight">Neural Oversight</option>
              <option value="Special Weaponry">Special Weaponry</option>
            </select>
          </div>
        </div>
      </div>

      {/* Directory Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="mib-classified-card p-6 h-56 animate-pulse flex flex-col justify-between"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-14 bg-mib-charcoal-800 rounded" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-mib-charcoal-800 rounded w-2/3" />
                  <div className="h-3 bg-mib-charcoal-800 rounded w-1/3" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-mib-charcoal-800 rounded w-full" />
                <div className="h-3 bg-mib-charcoal-800 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="mib-classified-card p-12 text-center max-w-lg mx-auto space-y-4">
          <Terminal className="w-10 h-10 text-mib-crimson-500 mx-auto" />
          <h2 className="text-lg font-display font-bold text-white">
            TELEMETRY LINK SEVERED
          </h2>
          <p className="text-xs font-mono text-mib-silver-400">
            {error?.message || 'Unable to connect to the MIB directory database.'}
          </p>
        </div>
      ) : agents && agents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <Link
              key={agent.slug}
              to={`/agent/${agent.slug}`}
              className="group block mib-classified-card p-6 hover:border-mib-cyan-400/80 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {/* Photo or silhouette avatar */}
                  <div className="w-12 h-14 rounded bg-mib-obsidian-950 border border-mib-charcoal-600 overflow-hidden flex items-center justify-center shrink-0">
                    {agent.photograph_url ? (
                      <img
                        src={agent.photograph_url}
                        alt={agent.codename}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                      />
                    ) : (
                      <Shield className="w-6 h-6 text-mib-silver-500 group-hover:text-mib-cyan-400 transition-colors" />
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-mib-silver-500 uppercase block">
                      {agent.agent_number}
                    </span>
                    <h2 className="text-lg font-display font-bold text-white tracking-wide group-hover:text-mib-cyan-300 transition-colors">
                      {agent.codename}
                    </h2>
                    <span className="text-xs font-mono text-mib-silver-400">
                      {agent.rank}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-1 text-xs font-mono text-mib-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>VIEW</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Details band */}
              <div className="mt-4 pt-4 border-t border-mib-charcoal-800/80 flex items-center justify-between text-xs font-mono">
                <div className="text-mib-silver-400 truncate max-w-[200px]">
                  {agent.division}
                </div>
                <div className="px-2 py-0.5 rounded bg-mib-amber-500/10 text-mib-amber-300 border border-mib-amber-500/30 text-[10px] font-semibold">
                  {agent.clearance_level}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* Empty Results */
        <div className="mib-classified-card p-12 text-center max-w-lg mx-auto space-y-4">
          <UserX className="w-10 h-10 text-mib-silver-500 mx-auto" />
          <h2 className="text-lg font-display font-bold text-white">
            NO MATCHING OPERATIVES LOCATED
          </h2>
          <p className="text-xs font-mono text-mib-silver-400">
            No active operatives match the search filter criteria.
          </p>
          <div className="pt-2">
            <Link
              to="/agent/k"
              className="inline-flex items-center space-x-2 text-xs font-mono text-mib-cyan-400 hover:text-mib-cyan-300 underline"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Inspect Default Profile: Agent K</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

