import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const statusColors = {
  draft: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  complete: 'bg-green-500/10 text-green-400 border-green-500/20',
};

export default function Dashboard() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('feasibility_reports')
        .select('id, title, status, created_at, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      setReports(data || []);
      setLoading(false);
    }
    load();
  }, [user.id]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
          <p className="text-slate-400 mt-1">Your feasibility reports</p>
        </div>
        <Link
          to="/reports/new"
          className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-light transition-colors"
        >
          + New Report
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
        </div>
      ) : reports.length === 0 ? (
        <div className="rounded-xl border border-dashed border-surface-border bg-surface p-12 text-center">
          <p className="text-slate-400 mb-4">No reports yet. Create your first feasibility report!</p>
          <Link
            to="/reports/new"
            className="inline-block rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-light transition-colors"
          >
            + New Report
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => (
            <Link
              key={report.id}
              to={report.status === 'draft' ? `/reports/${report.id}/edit` : `/reports/${report.id}`}
              className="group rounded-xl border border-surface-border bg-surface p-6 hover:border-brand/40 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-slate-100 group-hover:text-brand-light transition-colors">
                  {report.title}
                </h3>
                <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColors[report.status] || statusColors.draft}`}>
                  {report.status}
                </span>
              </div>
              <p className="text-sm text-slate-500">
                Created {new Date(report.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
