"use client";

import { useEffect, useState, useCallback } from "react";
import {
  fetchCandidates,
  suspendCandidate,
  deleteCandidate,
  downloadCandidatesCSV,
} from "@/services/admin";
import type { Candidate, VerifiedFilter, ActiveFilter } from "@/types/admin";
import {
  Search,
  Download,
  CheckCircle2,
  XCircle,
  Ban,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const PAGE_SIZE = 20;

function VerificationBadge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
        ok ? "bg-amber-500/10 text-amber-400" : "bg-slate-500/10 text-slate-400"
      }`}
    >
      {ok ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
      {label}
    </span>
  );
}

export default function CandidateTable() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState<VerifiedFilter>("all");
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [actioningId, setActioningId] = useState<number | null>(null);

  const loadCandidates = useCallback(() => {
    setLoading(true);
    setError(null);

    fetchCandidates({
      search: search || undefined,
      verified: verifiedFilter === "all" ? undefined : verifiedFilter,
      is_active: activeFilter === "all" ? undefined : activeFilter,
      page,
    })
      .then((res) => {
        setCandidates(res.results);
        setCount(res.count);
      })
      .catch(() => setError("Couldn't load candidates. Try refreshing."))
      .finally(() => setLoading(false));
  }, [search, verifiedFilter, activeFilter, page]);

  useEffect(() => {
    const timeout = setTimeout(loadCandidates, search ? 350 : 0);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, verifiedFilter, activeFilter, page]);

  const handleSuspend = async (candidate: Candidate) => {
    setActioningId(candidate.id);
    try {
      await suspendCandidate(candidate.id);
      loadCandidates();
    } catch {
      setError("Couldn't update this candidate. Try again.");
    } finally {
      setActioningId(null);
    }
  };

  const handleDelete = async (candidate: Candidate) => {
    const confirmed = window.confirm(
      `Delete ${candidate.username} (${candidate.email})? This cannot be undone.`
    );
    if (!confirmed) return;

    setActioningId(candidate.id);
    try {
      await deleteCandidate(candidate.id);
      loadCandidates();
    } catch {
      setError("Couldn't delete this candidate. Try again.");
    } finally {
      setActioningId(null);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await downloadCandidatesCSV();
    } catch {
      setError("Couldn't export CSV. Try again.");
    } finally {
      setExporting(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Search name, email, phone..."
            className="w-full rounded-lg border border-white/10 bg-[#1E2640] py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-amber-500/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={verifiedFilter}
            onChange={(e) => {
              setPage(1);
              setVerifiedFilter(e.target.value as VerifiedFilter);
            }}
            className="rounded-lg border border-white/10 bg-[#1E2640] px-3 py-2 text-sm text-slate-300 outline-none focus:border-amber-500/50"
          >
            <option value="all">All verification</option>
            <option value="email">Email verified</option>
            <option value="none">Not verified</option>
          </select>

          <select
            value={activeFilter}
            onChange={(e) => {
              setPage(1);
              setActiveFilter(e.target.value as ActiveFilter);
            }}
            className="rounded-lg border border-white/10 bg-[#1E2640] px-3 py-2 text-sm text-slate-300 outline-none focus:border-amber-500/50"
          >
            <option value="all">All status</option>
            <option value="true">Active</option>
            <option value="false">Suspended</option>
          </select>

          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#1E2640] px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 disabled:opacity-60"
          >
            <Download className="h-3.5 w-3.5" />
            {exporting ? "Exporting..." : "Export CSV"}
          </button>
        </div>
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
              <th className="px-4 py-3 font-medium">Candidate</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Verification</th>
              <th className="px-4 py-3 font-medium">Score</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-b border-white/5">
                  <td colSpan={7} className="px-4 py-4">
                    <div className="h-4 w-full animate-pulse rounded bg-white/5" />
                  </td>
                </tr>
              ))
            ) : candidates.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                  No candidates match these filters.
                </td>
              </tr>
            ) : (
              candidates.map((candidate) => (
                <tr key={candidate.id} className="border-b border-white/5 text-slate-200">
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{candidate.username}</div>
                    <div className="text-xs text-slate-500">{candidate.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <VerificationBadge ok={candidate.is_email_verified} label="Email" />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {candidate.latest_total_score ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        candidate.is_active
                          ? "bg-amber-500/10 text-amber-400"
                          : "bg-amber-500/10 text-amber-400"
                      }`}
                    >
                      {candidate.is_active ? "Active" : "Suspended"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {new Date(candidate.date_joined).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleSuspend(candidate)}
                        disabled={actioningId === candidate.id}
                        title={candidate.is_active ? "Suspend" : "Reinstate"}
                        className="rounded-md p-1.5 text-slate-400 transition hover:bg-white/5 hover:text-amber-400 disabled:opacity-50"
                      >
                        <Ban className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(candidate)}
                        disabled={actioningId === candidate.id}
                        title="Delete"
                        className="rounded-md p-1.5 text-slate-400 transition hover:bg-white/5 hover:text-red-400 disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && count > 0 && (
        <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
          <span>
            {count} candidate{count !== 1 ? "s" : ""} · Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1.5 disabled:opacity-40"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1.5 disabled:opacity-40"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
