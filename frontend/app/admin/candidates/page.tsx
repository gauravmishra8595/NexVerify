import AdminShell from "@/components/admin/AdminShell";
import CandidateTable from "@/components/admin/CandidateTable";

export default function AdminCandidatesPage() {
  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-white">Candidates</h1>
        <p className="text-sm text-slate-400">
          Search, filter, and manage every candidate on the platform.
        </p>
      </div>

      <CandidateTable />
    </AdminShell>
  );
}
