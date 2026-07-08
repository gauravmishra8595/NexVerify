"use client";

import { CheckCircle2, Clock, Lock } from "lucide-react";

interface ActivityItem {
  label: string;
  timestamp?: string;
  status: "completed" | "pending" | "locked";
}

interface RecentActivityProps {
  items: ActivityItem[];
}

const STATUS_ICONS = {
  completed: CheckCircle2,
  pending: Clock,
  locked: Lock,
};

const STATUS_COLORS = {
  completed: "text-amber-400",
  pending: "text-slate-400",
  locked: "text-slate-600",
};

/**
 * Vertical timeline of recent candidate activity — verification,
 * assessment completion, resume upload, certificate generation.
 */
export default function RecentActivity({ items }: RecentActivityProps) {
  if (items.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-slate-500">
        No activity yet. Start by verifying your email.
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {items.map((item, i) => {
        const Icon = STATUS_ICONS[item.status];
        return (
          <div
            key={i}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition hover:bg-white/5"
          >
            <Icon className={`h-4 w-4 shrink-0 ${STATUS_COLORS[item.status]}`} />
            <div className="flex-1">
              <p className="text-sm text-slate-200">{item.label}</p>
              {item.timestamp && (
                <p className="text-xs text-slate-500">
                  {new Date(item.timestamp).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
