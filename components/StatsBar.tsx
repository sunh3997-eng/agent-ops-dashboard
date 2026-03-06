"use client";

import { Activity, DollarSign, Layers, Zap } from "lucide-react";
import { Agent } from "@/lib/types";

interface StatsBarProps {
  agents: Agent[];
}

export default function StatsBar({ agents }: StatsBarProps) {
  const activeCount = agents.filter((a) => a.status === "active").length;
  const totalCostToday = agents.reduce((s, a) => s + a.costToday, 0);
  const totalTokens = agents.reduce((s, a) => s + a.tokensUsed, 0);
  const avgTestPass = agents.reduce((s, a) => s + a.testPassRate, 0) / agents.length;

  const stats = [
    {
      icon: <Activity size={18} />,
      label: "Active Agents",
      value: `${activeCount} / ${agents.length}`,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      icon: <DollarSign size={18} />,
      label: "Cost Today",
      value: `$${totalCostToday.toFixed(2)}`,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      icon: <Zap size={18} />,
      label: "Tokens Used",
      value: `${(totalTokens / 1000).toFixed(0)}k`,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
    {
      icon: <Layers size={18} />,
      label: "Avg Test Pass",
      value: `${avgTestPass.toFixed(1)}%`,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className={`glass-card rounded-2xl p-4 flex items-center gap-4 border ${s.border}`}
        >
          <div className={`${s.bg} ${s.color} p-3 rounded-xl`}>{s.icon}</div>
          <div>
            <p className="text-xs text-slate-400 mb-0.5">{s.label}</p>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
