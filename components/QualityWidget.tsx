"use client";

import { QUALITY_METRICS } from "@/lib/mock-data";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from "recharts";
import { CheckCircle2, Code2, GitCommit, GitPullRequest } from "lucide-react";
import clsx from "clsx";

function ScoreRing({ score, color }: { score: number; color: string }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
      <svg width="64" height="64" className="-rotate-90">
        <circle cx="32" cy="32" r={radius} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="5" />
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <span className="absolute text-sm font-bold text-white">{score}</span>
    </div>
  );
}

const RADAR_DATA = [
  { subject: "Tests", cursor: 94, copilot: 88, claudeCode: 97, codebuff: 79 },
  { subject: "Diff", cursor: 85, copilot: 70, claudeCode: 78, codebuff: 55 },
  { subject: "Commits", cursor: 80, copilot: 75, claudeCode: 70, codebuff: 50 },
  { subject: "Files", cursor: 78, copilot: 65, claudeCode: 72, codebuff: 48 },
  { subject: "Score", cursor: 91, copilot: 83, claudeCode: 95, codebuff: 71 },
];

const AGENT_COLORS: Record<string, string> = {
  cursor: "#4f8ef7",
  copilot: "#2ecc71",
  claudeCode: "#9b59b6",
  codebuff: "#f39c12",
};

function getScoreColor(score: number) {
  if (score >= 90) return "text-emerald-400";
  if (score >= 80) return "text-blue-400";
  if (score >= 70) return "text-yellow-400";
  return "text-red-400";
}

export default function QualityWidget() {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="mb-5">
        <h2 className="font-semibold text-white">Code Quality Scores</h2>
        <p className="text-xs text-slate-400 mt-0.5">Diff lines · Test pass rate · Commit activity</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Metric cards */}
        <div className="space-y-3">
          {QUALITY_METRICS.map((m) => (
            <div
              key={m.agentId}
              className="flex items-center gap-4 bg-white/[0.03] rounded-xl p-3 border border-white/5"
            >
              <ScoreRing score={m.codeScore} color={m.color} />

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-medium text-sm text-white">{m.agentName}</span>
                  <span className={clsx("text-sm font-bold", getScoreColor(m.codeScore))}>
                    {m.codeScore}/100
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex items-center gap-1" title="Test pass rate">
                    <CheckCircle2 size={10} className="text-slate-500" />
                    <span className="text-xs text-slate-300">{m.testPassRate}%</span>
                  </div>
                  <div className="flex items-center gap-1" title="Diff lines">
                    <Code2 size={10} className="text-slate-500" />
                    <span className="text-xs text-slate-300">{m.diffLines}L</span>
                  </div>
                  <div className="flex items-center gap-1" title="Commits">
                    <GitCommit size={10} className="text-slate-500" />
                    <span className="text-xs text-slate-300">{m.commitCount} cmts</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Radar chart */}
        <div className="flex flex-col">
          <p className="text-xs text-slate-500 text-center mb-2">Performance Radar</p>
          <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={RADAR_DATA} margin={{ top: 8, right: 20, bottom: 8, left: 20 }}>
                <PolarGrid stroke="rgba(255,255,255,0.07)" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    background: "#1a1a2e",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 8,
                  }}
                  labelStyle={{ color: "#e8eaf6", fontSize: 12 }}
                  itemStyle={{ fontSize: 11 }}
                />
                {Object.entries(AGENT_COLORS).map(([key, color]) => (
                  <Radar
                    key={key}
                    name={key === "claudeCode" ? "Claude Code" : key.charAt(0).toUpperCase() + key.slice(1)}
                    dataKey={key}
                    stroke={color}
                    fill={color}
                    fillOpacity={0.1}
                    strokeWidth={1.5}
                    dot={false}
                  />
                ))}
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {Object.entries(AGENT_COLORS).map(([key, color]) => (
              <div key={key} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                <span className="text-xs text-slate-400">
                  {key === "claudeCode" ? "Claude Code" : key.charAt(0).toUpperCase() + key.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary bar */}
      <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-4 gap-4">
        {[
          { icon: <GitPullRequest size={14} />, label: "Total Diff", value: "842 lines" },
          { icon: <CheckCircle2 size={14} />, label: "Avg Pass Rate", value: "89.5%" },
          { icon: <GitCommit size={14} />, label: "Commits Today", value: "17" },
          { icon: <Code2 size={14} />, label: "Files Changed", value: "32" },
        ].map((s) => (
          <div key={s.label} className="flex flex-col items-center gap-1 text-center">
            <span className="text-slate-500">{s.icon}</span>
            <span className="text-base font-bold text-white">{s.value}</span>
            <span className="text-[10px] text-slate-500">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
