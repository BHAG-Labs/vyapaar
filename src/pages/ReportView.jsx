import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { supabase } from '../lib/supabase';

function ScoreBadge({ score }) {
  let color = 'text-red-400 border-red-500/30 bg-red-500/10';
  if (score >= 75) color = 'text-green-400 border-green-500/30 bg-green-500/10';
  else if (score >= 50) color = 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';

  return (
    <span className={`inline-flex items-center rounded-full border px-4 py-1.5 text-lg font-bold ${color}`}>
      {score}/100
    </span>
  );
}

function Section({ title, children }) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-slate-100 mb-4 pb-2 border-b border-surface-border">{title}</h2>
      {children}
    </section>
  );
}

function SwotCard({ title, items, color }) {
  const colors = {
    green: 'border-green-500/30 bg-green-500/5',
    red: 'border-red-500/30 bg-red-500/5',
    blue: 'border-blue-500/30 bg-blue-500/5',
    yellow: 'border-yellow-500/30 bg-yellow-500/5',
  };
  const titleColors = {
    green: 'text-green-400',
    red: 'text-red-400',
    blue: 'text-blue-400',
    yellow: 'text-yellow-400',
  };

  return (
    <div className={`rounded-xl border p-5 ${colors[color]}`}>
      <h3 className={`font-semibold mb-3 ${titleColors[color]}`}>{title}</h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-slate-300 flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-current shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ReportView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    supabase
      .from('feasibility_reports')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setReportData(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
      </div>
    );
  }

  if (!reportData?.report) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-400 mb-4">Report not found or not yet generated.</p>
        <button onClick={() => navigate('/dashboard')} className="text-brand-light hover:underline cursor-pointer">Back to Dashboard</button>
      </div>
    );
  }

  const { data: intake, report } = reportData;

  function handleDownloadPdf() {
    setToast('PDF download coming soon!');
    setTimeout(() => setToast(''), 3000);
  }

  const fmt = (n) => Number(n).toLocaleString('en-IN');

  return (
    <div className="max-w-4xl mx-auto print:max-w-none">
      {toast && (
        <div className="fixed top-4 right-4 z-50 rounded-lg bg-brand/90 px-5 py-3 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between mb-8 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">{reportData.title}</h1>
          <p className="text-slate-400 mt-1">
            Generated on {new Date(reportData.updated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/reports/${id}/edit`)}
            className="rounded-lg border border-surface-border px-5 py-2.5 text-sm font-medium text-slate-300 hover:bg-surface-light transition-colors cursor-pointer"
          >
            Edit
          </button>
          <button
            onClick={handleDownloadPdf}
            className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-light transition-colors cursor-pointer"
          >
            Download PDF
          </button>
        </div>
      </div>

      <div className="space-y-0 rounded-xl border border-surface-border bg-surface p-8 print:border-none print:p-0">
        <Section title="Executive Summary">
          <p className="text-slate-300 leading-relaxed">{report.executiveSummary}</p>
          <div className="mt-4 flex items-center gap-4">
            <span className="text-sm text-slate-400">Viability Score:</span>
            <ScoreBadge score={report.viabilityScore} />
          </div>
        </Section>

        <Section title="Business Overview">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              ['Business', intake.businessName],
              ['Model', intake.businessModel],
              ['Sector', intake.industry],
              ['Location', [intake.city, intake.state].filter(Boolean).join(', ')],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-surface-border bg-surface-light p-4">
                <p className="text-xs text-slate-500 mb-1">{label}</p>
                <p className="text-sm font-medium text-slate-200">{value || '—'}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Market Analysis">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-lg border border-surface-border bg-surface-light p-4">
                <p className="text-xs text-slate-500 mb-1">Market Size</p>
                <p className="text-lg font-semibold text-slate-200">₹{fmt(intake.marketSize)}</p>
              </div>
              <div className="rounded-lg border border-surface-border bg-surface-light p-4">
                <p className="text-xs text-slate-500 mb-1">Competition</p>
                <p className="text-sm text-slate-200">{intake.alternatives || 'Not specified'}</p>
              </div>
            </div>
            <div className="rounded-lg border border-surface-border bg-surface-light p-4">
              <p className="text-xs text-slate-500 mb-1">Target Customer</p>
              <p className="text-sm text-slate-300">{intake.targetCustomer || 'Not specified'}</p>
            </div>
            <div className="rounded-lg border border-surface-border bg-surface-light p-4">
              <p className="text-xs text-slate-500 mb-1">Pain Point</p>
              <p className="text-sm text-slate-300">{intake.painPoint || 'Not specified'}</p>
            </div>
          </div>
        </Section>

        <Section title="Product / Service Description">
          <p className="text-slate-300 mb-4">{intake.productDescription || 'Not specified'}</p>
          {intake.features?.filter(Boolean).length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-slate-400 mb-2">Key Features</p>
              <div className="flex flex-wrap gap-2">
                {intake.features.filter(Boolean).map((f, i) => (
                  <span key={i} className="rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-sm text-brand-light">{f}</span>
                ))}
              </div>
            </div>
          )}
          {intake.deliveryProcess && (
            <div className="rounded-lg border border-surface-border bg-surface-light p-4">
              <p className="text-xs text-slate-500 mb-1">Production / Delivery Process</p>
              <p className="text-sm text-slate-300">{intake.deliveryProcess}</p>
            </div>
          )}
        </Section>

        <Section title="Financial Summary">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-6">
            {[
              ['Investment', `₹${fmt(intake.initialInvestment)}`],
              ['Monthly Costs', `₹${fmt(intake.monthlyCosts)}`],
              ['Monthly Revenue', `₹${fmt(intake.monthlyRevenue)}`],
              ['Margin', `${report.margin}%`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-surface-border bg-surface-light p-4">
                <p className="text-xs text-slate-500 mb-1">{label}</p>
                <p className="text-lg font-semibold text-slate-200">{value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 mb-6">
            {[
              ['Break-even', `${intake.breakEvenMonths} months`],
              ['Monthly Profit', `₹${fmt(report.monthlyProfit)}`],
              ['Funding', intake.fundingSource || '—'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-surface-border bg-surface-light p-4">
                <p className="text-xs text-slate-500 mb-1">{label}</p>
                <p className="text-sm font-semibold text-slate-200">{value}</p>
              </div>
            ))}
          </div>

          <h3 className="text-sm font-semibold text-slate-300 mb-3">12-Month Projected P&L</h3>
          <div className="overflow-x-auto rounded-lg border border-surface-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-border bg-surface-light">
                  <th className="px-4 py-3 text-left font-medium text-slate-400">Month</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-400">Revenue</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-400">Costs</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-400">Profit</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-400">Cumulative</th>
                </tr>
              </thead>
              <tbody>
                {report.projections.map((row) => (
                  <tr key={row.month} className="border-b border-surface-border/50">
                    <td className="px-4 py-2.5 text-slate-300">M{row.month}</td>
                    <td className="px-4 py-2.5 text-right text-slate-300">₹{fmt(row.revenue)}</td>
                    <td className="px-4 py-2.5 text-right text-slate-300">₹{fmt(row.costs)}</td>
                    <td className={`px-4 py-2.5 text-right font-medium ${row.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ₹{fmt(row.profit)}
                    </td>
                    <td className={`px-4 py-2.5 text-right ${row.cumulative >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ₹{fmt(row.cumulative)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="SWOT Analysis">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SwotCard title="Strengths" items={report.strengths} color="green" />
            <SwotCard title="Weaknesses" items={report.weaknesses} color="red" />
            <SwotCard title="Opportunities" items={report.opportunities} color="blue" />
            <SwotCard title="Threats" items={report.threats} color="yellow" />
          </div>
        </Section>

        <Section title="Risk Assessment">
          <div className="space-y-4">
            {report.risks.map((r, i) => {
              const impactColor = r.impact === 'Critical' ? 'text-red-400 bg-red-500/10 border-red-500/20'
                : r.impact === 'High' ? 'text-orange-400 bg-orange-500/10 border-orange-500/20'
                : 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
              return (
                <div key={i} className="rounded-lg border border-surface-border bg-surface-light p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-slate-200">{r.risk}</h4>
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${impactColor}`}>{r.impact}</span>
                  </div>
                  <p className="text-sm text-slate-400"><span className="text-slate-500">Mitigation:</span> {r.mitigation}</p>
                </div>
              );
            })}
          </div>
        </Section>

        <Section title="Recommendation">
          <div className="rounded-xl border border-brand/30 bg-brand/5 p-6">
            <div className="flex items-center gap-4 mb-3">
              <ScoreBadge score={report.viabilityScore} />
              <h3 className="text-lg font-bold text-slate-100">
                {report.viabilityScore >= 75 ? 'Highly Viable' : report.viabilityScore >= 50 ? 'Viable with Caution' : 'Needs Rework'}
              </h3>
            </div>
            <p className="text-slate-300 leading-relaxed">{report.recommendation}</p>
          </div>
        </Section>
      </div>
    </div>
  );
}
