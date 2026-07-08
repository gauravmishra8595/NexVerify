import AdminShell from "@/components/admin/AdminShell";
import AnalyticsOverview from "@/components/admin/AnalyticsOverview";

export default function AdminOverviewPage() {
  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-white">Overview</h1>
        <p className="text-sm text-slate-400">
          Platform-wide stats across candidates, verification, and assessments.
        </p>
      </div>

      <AnalyticsOverview />
    </AdminShell>
  );
}
