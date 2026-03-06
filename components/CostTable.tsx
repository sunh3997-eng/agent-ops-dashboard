"use client";

import { COST_BREAKDOWN } from "@/lib/mock-data";
import { TrendingUp } from "lucide-react";

function formatTokens(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

export default function CostTable() {
  const totalToday = COST_BREAKDOWN.reduce((s, r) => s + r.costToday, 0);
  const totalWeek = COST_BREAKDOWN.reduce((s, r) => s + r.costWeek, 0);
  const totalAll = COST_BREAKDOWN.reduce((s, r) => s + r.costTotal, 0);

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-semibold text-white">Cost Breakdown</h2>
          <p className="text-xs text-slate-400 mt-0.5">By agent and model</p>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          <TrendingUp size={12} />
          <span className="text-xs font-medium">${totalToday.toFixed(2)} today</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              {["Agent", "Model", "Input", "Output", "Today", "This Week", "Total"].map((h) => (
                <th
                  key={h}
                  className="text-left pb-2.5 text-xs font-medium text-slate-500 pr-4 last:pr-0 whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COST_BREAKDOWN.map((row) => (
              <tr key={row.agent} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: row.color }}
                    />
                    <span className="text-white font-medium whitespace-nowrap">{row.agent}</span>
                  </div>
                </td>
                <td className="py-3 pr-4">
                  <span className="text-xs font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded whitespace-nowrap">
                    {row.model}
                  </span>
                </td>
                <td className="py-3 pr-4 text-slate-300 font-mono text-xs whitespace-nowrap">
                  {formatTokens(row.inputTokens)}
                </td>
                <td className="py-3 pr-4 text-slate-300 font-mono text-xs whitespace-nowrap">
                  {formatTokens(row.outputTokens)}
                </td>
                <td className="py-3 pr-4 font-semibold text-white whitespace-nowrap">
                  ${row.costToday.toFixed(2)}
                </td>
                <td className="py-3 pr-4 text-slate-300 whitespace-nowrap">
                  ${row.costWeek.toFixed(2)}
                </td>
                <td className="py-3 text-slate-400 whitespace-nowrap">${row.costTotal.toFixed(2)}</td>
              </tr>
            ))}
            {/* Totals */}
            <tr className="bg-white/[0.02]">
              <td colSpan={4} className="py-3 pr-4 text-xs font-semibold text-slate-300 uppercase tracking-wide">
                Total
              </td>
              <td className="py-3 pr-4 font-bold text-white">${totalToday.toFixed(2)}</td>
              <td className="py-3 pr-4 font-semibold text-slate-200">${totalWeek.toFixed(2)}</td>
              <td className="py-3 font-semibold text-slate-200">${totalAll.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
