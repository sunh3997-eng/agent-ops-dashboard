"use client";

import { formatDistanceToNow } from "date-fns";
import clsx from "clsx";

interface ConnectionBadgeProps {
  connected: boolean;
  lastUpdate: Date;
}

export default function ConnectionBadge({ connected, lastUpdate }: ConnectionBadgeProps) {
  return (
    <div
      className={clsx(
        "flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium",
        connected
          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
          : "bg-slate-500/10 border-slate-500/20 text-slate-400"
      )}
    >
      <span
        className={clsx(
          "w-1.5 h-1.5 rounded-full",
          connected ? "bg-emerald-400 status-dot-active" : "bg-slate-400"
        )}
      />
      {connected ? "Live" : "Offline"}
      <span className="text-slate-500">·</span>
      <span className="text-slate-500">
        {formatDistanceToNow(lastUpdate, { addSuffix: true })}
      </span>
    </div>
  );
}
