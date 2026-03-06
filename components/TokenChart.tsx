"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { DAILY_TOKEN_DATA, WEEKLY_TOKEN_DATA } from "@/lib/mock-data";
import { TimeRange } from "@/lib/types";
import clsx from "clsx";

const AGENT_COLORS = {
  cursor: "#4f8ef7",
  copilot: "#2ecc71",
  claudeCode: "#9b59b6",
  codebuff: "#f39c12",
};

const AGENT_LABELS: Record<string, string> = {
  cursor: "Cursor",
  copilot: "Copilot",
  claudeCode: "Claude Code",
  codebuff: "Codebuff",
};

function formatTokens(value: number) {
  if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
  return String(value);
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s: number, p: { value: number }) => s + (p.value ?? 0), 0);
  return (
    <div className="bg-[#1a1a2e] border border-white/10 rounded-xl p-3 shadow-2xl min-w-[160px]">
      <p className="text-xs text-slate-400 mb-2 font-medium">{label}</p>
      {payload.map((p: { name: string; value: number; color: string }) => (
        <div key={p.name} className="flex items-center justify-between gap-4 py-0.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-xs text-slate-300">{AGENT_LABELS[p.name] ?? p.name}</span>
          </div>
          <span className="text-xs font-mono text-white">{formatTokens(p.value)}</span>
        </div>
      ))}
      <div className="mt-2 pt-2 border-t border-white/10 flex justify-between">
        <span className="text-xs text-slate-400">Total</span>
        <span className="text-xs font-mono font-semibold text-white">{formatTokens(total)}</span>
      </div>
    </div>
  );
}

export default function TokenChart() {
  const [range, setRange] = useState<TimeRange>("daily");
  const data = range === "daily" ? DAILY_TOKEN_DATA : WEEKLY_TOKEN_DATA;

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-semibold text-white">Token Consumption</h2>
          <p className="text-xs text-slate-400 mt-0.5">Tokens used per agent over time</p>
        </div>
        <div className="flex bg-white/5 rounded-lg p-0.5 gap-0.5">
          {(["daily", "weekly"] as TimeRange[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={clsx(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                range === r
                  ? "bg-white/15 text-white shadow"
                  : "text-slate-400 hover:text-white"
              )}
            >
              {r === "daily" ? "24h" : "7d"}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
          <defs>
            {Object.entries(AGENT_COLORS).map(([key, color]) => (
              <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0.02} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="time"
            tick={{ fill: "#64748b", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            interval={range === "daily" ? 5 : 0}
          />
          <YAxis
            tickFormatter={formatTokens}
            tick={{ fill: "#64748b", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span style={{ color: "#94a3b8", fontSize: 11 }}>{AGENT_LABELS[value] ?? value}</span>
            )}
          />
          {Object.entries(AGENT_COLORS).map(([key, color]) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stroke={color}
              strokeWidth={2}
              fill={`url(#grad-${key})`}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
