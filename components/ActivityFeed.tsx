"use client";

import { ActivityEntry, ActivityType } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useRef } from "react";
import clsx from "clsx";

const TYPE_CONFIG: Record<ActivityType, { icon: string; color: string }> = {
  task_start: { icon: "▶", color: "text-blue-400" },
  task_complete: { icon: "✓", color: "text-emerald-400" },
  error: { icon: "✕", color: "text-red-400" },
  file_edit: { icon: "✎", color: "text-violet-400" },
  test_run: { icon: "◉", color: "text-cyan-400" },
  commit: { icon: "⎇", color: "text-amber-400" },
  token_spike: { icon: "↑", color: "text-orange-400" },
};

interface Props {
  activities: ActivityEntry[];
}

export default function ActivityFeed({ activities }: Props) {
  const listRef = useRef<HTMLDivElement>(null);
  const prevLenRef = useRef(activities.length);

  // Auto-scroll to top on new activity
  useEffect(() => {
    if (activities.length > prevLenRef.current && listRef.current) {
      listRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
    prevLenRef.current = activities.length;
  }, [activities.length]);

  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col h-full min-h-[400px]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-semibold text-white">Activity Feed</h2>
          <p className="text-xs text-slate-400 mt-0.5">Live agent events</p>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 status-dot-active" />
          <span className="text-xs font-medium">Live</span>
        </div>
      </div>

      <div
        ref={listRef}
        className="flex-1 overflow-y-auto space-y-1 pr-1 max-h-[520px]"
      >
        {activities.map((entry, i) => {
          const cfg = TYPE_CONFIG[entry.type];
          const isNew = i === 0;
          return (
            <div
              key={entry.id}
              className={clsx(
                "flex gap-3 p-2.5 rounded-xl border transition-all duration-500",
                isNew
                  ? "border-white/10 bg-white/[0.04]"
                  : "border-transparent hover:bg-white/[0.02]"
              )}
            >
              {/* Agent dot + type icon */}
              <div className="flex flex-col items-center gap-1 pt-0.5 flex-shrink-0">
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold"
                  style={{
                    background: `${entry.agentColor}20`,
                    color: entry.agentColor,
                  }}
                >
                  {entry.agentIcon}
                </div>
                {i < activities.length - 1 && (
                  <div className="w-px flex-1 min-h-[16px] bg-white/[0.06]" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className="text-[11px] font-medium"
                      style={{ color: entry.agentColor }}
                    >
                      {entry.agentName}
                    </span>
                    <span className={clsx("text-[10px] font-mono font-bold", cfg.color)}>
                      {cfg.icon}
                    </span>
                    <span className={clsx("text-[10px] uppercase tracking-wide font-medium", cfg.color)}>
                      {entry.type.replace("_", " ")}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-600 whitespace-nowrap flex-shrink-0">
                    {formatDistanceToNow(entry.timestamp, { addSuffix: true })}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{entry.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
