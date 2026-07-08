import AdminShell from "@/components/admin/AdminShell";
import NotificationLogTable from "@/components/admin/NotificationLogTable";

export default function AdminNotificationsPage() {
  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-white">Notification Logs</h1>
        <p className="text-sm text-slate-400">
          Every OTP and notification send attempt, for debugging delivery issues.
        </p>
      </div>

      <NotificationLogTable />
    </AdminShell>
  );
}
