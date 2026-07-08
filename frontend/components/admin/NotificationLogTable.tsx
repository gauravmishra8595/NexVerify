"use client";

import { useEffect, useState } from "react";
import { fetchNotificationLogs } from "@/services/admin";
import type { NotificationLogEntry } from "@/types/admin";
import { CheckCircle2, XCircle, Mail } from "lucide-react";

const CHANNEL_ICONS: Record<string, React.ElementType> = {
  EMAIL: Mail,
};

export default function NotificationLogTable() {
  const [logs, setLogs] = useState<NotificationLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [channelFilter, setChannelFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchNotificationLogs({
      channel: channelFilter || undefined,
      status: statusFilter || undefined,
    })
      .then(setLogs)
      .catch(() => setError("Couldn't load notification logs."))
      .finally(() => setLoading(false));
  }, [channelFilter, statusFilter]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        <select
          value={channelFilter}
          onChange={(e) => setChannelFilter(e.target.value)}
          className="rounded-lg border border-white/10 bg-[#1E2640] px-3 py-2 text-sm text-slate-300 outline-none focus:border-amber-500/50"
        >
          <option value="">All channels</option>
          <option value="EMAIL">Email</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-white/10 bg-[#1E2640] px-3 py-2 text-sm text-slate-300 outline-none focus:border-amber-500/50"
        >
          <option value="">All statuses</option>
          <option value="SENT">Sent</option>
          <option value="FAILED">Failed</option>
        </select>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-[#1E2640] text-left text-xs text-slate-400">
              <th className="px-4 py-3 font-medium">Channel</th>
              <th className="px-4 py-3 font-medium">Destination</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Error</th>
              <th className="px-4 py-3 font-medium">Time</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-b border-white/5">
                  <td colSpan={5} className="px-4 py-4">
                    <div className="h-4 w-full animate-pulse rounded bg-white/5" />
                  </td>
                </tr>
              ))
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                  No notifications logged yet.
                </td>
              </tr>
            ) : (
              logs.map((log) => {
                const Icon = CHANNEL_ICONS[log.channel] ?? Mail;
                return (
                  <tr key={log.id} className="border-b border-white/5 text-slate-200">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Icon className="h-3.5 w-3.5 text-slate-500" />
                        {log.channel}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-300">
                      {log.destination}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          log.status === "SENT"
                            ? "bg-amber-500/10 text-amber-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {log.status === "SENT" ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}
                        {log.status}
                      </span>
                    </td>
                    <td className="max-w-xs truncate px-4 py-3 text-xs text-slate-500">
                      {log.error_message || "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
