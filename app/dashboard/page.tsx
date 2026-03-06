"use client";

import { useAgentStatus } from "@/hooks/useAgentStatus";
import AgentCard from "@/components/AgentCard";
import TokenChart from "@/components/TokenChart";
import CostTable from "@/components/CostTable";
import QualityWidget from "@/components/QualityWidget";
import StatsBar from "@/components/StatsBar";
import ConnectionBadge from "@/components/ConnectionBadge";
import ActivityFeed from "@/components/ActivityFeed";
import { LayoutDashboard, RefreshCw } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

export default function DashboardPage() {
  const { agents, connected, lastUpdate, activities, refreshAgent } = useAgentStatus();
  const [refreshing, setRefreshing] = useState(false);

  function handleRefreshAll() {
    setRefreshing(true);
    agents.forEach((a) => refreshAgent(a.id));
    setTimeout(() => setRefreshing(false), 800);
  }

  return (
    <div className="min-h-screen bg-[#0d0d1a]">
      {/* Background gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/15 border border-blue-500/20 rounded-xl">
              <LayoutDashboard size={20} className="text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Agent Ops Dashboard</h1>
              <p className="text-xs text-slate-500 mt-0.5">AI 编码 Agent 统一管控面板</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ConnectionBadge connected={connected} lastUpdate={lastUpdate} />
            <button
              onClick={handleRefreshAll}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs text-slate-300 hover:text-white transition-all"
            >
              <RefreshCw size={13} className={clsx(refreshing && "animate-spin")} />
              Refresh All
            </button>
          </div>
        </header>

        {/* Stats bar */}
        <section className="mb-6">
          <StatsBar agents={agents} />
        </section>

        {/* Agent cards grid */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
              Agent Status
            </h2>
            <span className="text-xs text-slate-600">
              {agents.filter((a) => a.status === "active").length} active
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} onRefresh={refreshAgent} />
            ))}
          </div>
        </section>

        {/* Token chart + Activity Feed */}
        <section className="mb-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <TokenChart />
          </div>
          <div className="xl:col-span-1">
            <ActivityFeed activities={activities} />
          </div>
        </section>

        {/* Cost + Quality grid */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          <CostTable />
          <QualityWidget />
        </section>

        {/* Footer */}
        <footer className="text-center text-xs text-slate-600 py-4 border-t border-white/[0.04]">
          Agent Ops Dashboard · Mock WebSocket data · Agents update every 3s · New events every ~5s
        </footer>
      </div>
    </div>
  );
}
