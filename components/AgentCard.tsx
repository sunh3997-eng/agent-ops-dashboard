"use client";

import { Agent, AgentStatus } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { Activity, AlertCircle, Clock, Cpu, DollarSign, RefreshCw } from "lucide-react";
import clsx from "clsx";

interface AgentCardProps {
  agent: Agent;
  onRefresh?: (id: string) => void;
}

const STATUS_CONFIG: Record<
  AgentStatus,
  { label: string; color: string; bg: string; dotClass: string }
> = {
  active: {
    label: "Active",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    dotClass: "bg-emerald-400 status-dot-active",
  },
  idle: {
    label: "Idle",
    color: "text-slate-400",
    bg: "bg-slate-500/10 border-slate-500/20",
    dotClass: "bg-slate-400",
  },
  error: {
    label: "Error",
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
    dotClass: "bg-red-400 status-dot-active",
  },
  paused: {
    label: "Paused",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10 border-yellow-500/20",
    dotClass: "bg-yellow-400",
  },
};

function TokenBar({ used, limit, color }: { used: number; limit: number; color: string }) {
  const pct = Math.min((used / limit) * 100, 100);
  const isHigh = pct > 80;
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-slate-400">Tokens</span>
        <span className={clsx("text-xs font-mono", isHigh ? "text-red-400" : "text-slate-300")}>
          {(used / 1000).toFixed(1)}k / {(limit / 1000).toFixed(0)}k
        </span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: isHigh
              ? "linear-gradient(90deg, #ef4444, #f97316)"
              : `linear-gradient(90deg, ${color}aa, ${color})`,
          }}
        />
      </div>
    </div>
  );
}

export default function AgentCard({ agent, onRefresh }: AgentCardProps) {
  const sc = STATUS_CONFIG[agent.status];

  return (
    <div
      className="glass-card rounded-2xl p-5 flex flex-col gap-4 hover:border-white/15 transition-all duration-300"
      style={{ borderLeft: `3px solid ${agent.color}` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold"
            style={{ background: `${agent.color}20`, color: agent.color }}
          >
            {agent.icon}
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">{agent.name}</h3>
            <span className="text-xs text-slate-400 font-mono">{agent.model}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className={clsx("flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium", sc.bg, sc.color)}>
            <span className={clsx("w-1.5 h-1.5 rounded-full", sc.dotClass)} />
            {sc.label}
          </div>
          {onRefresh && (
            <button
              onClick={() => onRefresh(agent.id)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              title="Refresh"
            >
              <RefreshCw size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Current task */}
      <div className="bg-white/[0.03] rounded-lg px-3 py-2.5 border border-white/5">
        <div className="flex items-start gap-2">
          {agent.status === "error" ? (
            <AlertCircle size={13} className="text-red-400 mt-0.5 flex-shrink-0" />
          ) : (
            <Activity size={13} className="text-slate-400 mt-0.5 flex-shrink-0" />
          )}
          <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">{agent.currentTask}</p>
        </div>
      </div>

      {/* Token bar */}
      <TokenBar used={agent.tokensUsed} limit={agent.tokensLimit} color={agent.color} />

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center gap-1 bg-white/[0.03] rounded-lg p-2">
          <DollarSign size={12} className="text-slate-500" />
          <span className="text-sm font-semibold text-white">${agent.costToday.toFixed(2)}</span>
          <span className="text-[10px] text-slate-500">Today</span>
        </div>
        <div className="flex flex-col items-center gap-1 bg-white/[0.03] rounded-lg p-2">
          <Cpu size={12} className="text-slate-500" />
          <span className="text-sm font-semibold text-white">{agent.filesChanged}</span>
          <span className="text-[10px] text-slate-500">Files</span>
        </div>
        <div className="flex flex-col items-center gap-1 bg-white/[0.03] rounded-lg p-2">
          <Clock size={12} className="text-slate-500" />
          <span className="text-sm font-semibold text-white">
            {formatDistanceToNow(agent.lastActivity, { addSuffix: false })}
          </span>
          <span className="text-[10px] text-slate-500">Ago</span>
        </div>
      </div>
    </div>
  );
}
