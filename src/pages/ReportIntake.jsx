import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const STEPS = ['Business Basics', 'Market & Customers', 'Product & Operations', 'Financial Projections', 'Team & Timeline'];

const INDUSTRIES = ['Agriculture', 'Manufacturing', 'Retail', 'Food & Beverage', 'Technology', 'Healthcare', 'Education', 'Logistics', 'Other'];
const MODELS = ['B2B', 'B2C', 'B2B2C', 'D2C', 'Marketplace'];
const FUNDING_SOURCES = ['Bootstrapped', 'Angel', 'VC', 'Bank Loan', 'Government Grant'];

const INITIAL_DATA = {
  businessName: '',
  industry: '',
  businessModel: '',
  city: '',
  state: '',
  targetCustomer: '',
  marketSize: '',
  painPoint: '',
  alternatives: '',
  productDescription: '',
  features: [''],
  rawMaterials: '',
  deliveryProcess: '',
  initialInvestment: '',
  monthlyCosts: '',
  monthlyRevenue: '',
  breakEvenMonths: '',
  fundingSource: '',
  teamSize: '',
  keyHires: '',
  launchTimeline: '',
  regulatoryRequirements: '',
};

function generateReport(data) {
  const investment = Number(data.initialInvestment) || 0;
  const costs = Number(data.monthlyCosts) || 0;
  const revenue = Number(data.monthlyRevenue) || 0;
  const breakEven = Number(data.breakEvenMonths) || 12;
  const margin = revenue > 0 ? ((revenue - costs) / revenue) * 100 : 0;
  const monthlyProfit = revenue - costs;

  const projections = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const growthFactor = 1 + (i * 0.05);
    const projRevenue = Math.round(revenue * growthFactor);
    const projCosts = Math.round(costs * (1 + i * 0.02));
    const projProfit = projRevenue - projCosts;
    const cumulative = (monthlyProfit * month) - investment + (projRevenue - revenue) * month / 2;
    return { month, revenue: projRevenue, costs: projCosts, profit: projProfit, cumulative: Math.round(cumulative) };
  });

  const marketSizeNum = Number(data.marketSize) || 0;

  let viabilityScore = 50;
  if (margin > 40) viabilityScore += 15;
  else if (margin > 20) viabilityScore += 10;
  else if (margin > 0) viabilityScore += 5;
  else viabilityScore -= 10;

  if (breakEven <= 6) viabilityScore += 15;
  else if (breakEven <= 12) viabilityScore += 10;
  else if (breakEven <= 24) viabilityScore += 5;
  else viabilityScore -= 5;

  if (marketSizeNum > 10000000) viabilityScore += 10;
  else if (marketSizeNum > 1000000) viabilityScore += 5;

  if (investment < 500000) viabilityScore += 5;
  if (data.features.filter(Boolean).length >= 3) viabilityScore += 5;
  viabilityScore = Math.max(0, Math.min(100, viabilityScore));

  const strengths = [];
  const weaknesses = [];
  const opportunities = [];
  const threats = [];

  if (margin > 30) strengths.push('Strong profit margins indicate healthy unit economics');
  if (investment < 500000) strengths.push('Low initial investment reduces financial risk');
  if (data.features.filter(Boolean).length >= 3) strengths.push('Multiple product features create differentiation');
  if (data.businessModel === 'D2C') strengths.push('Direct-to-consumer model allows better margin control');
  if (strengths.length === 0) strengths.push('First-mover opportunity in chosen market segment');

  if (margin < 15) weaknesses.push('Thin margins may not sustain operations during downturns');
  if (breakEven > 18) weaknesses.push('Long break-even timeline increases investor risk');
  if (!data.teamSize || Number(data.teamSize) < 3) weaknesses.push('Small team size may limit execution capacity');
  if (weaknesses.length === 0) weaknesses.push('New entrant without established brand recognition');

  if (marketSizeNum > 1000000) opportunities.push('Large addressable market provides significant growth potential');
  opportunities.push('Digital India initiatives creating new market opportunities');
  if (data.industry === 'Technology' || data.industry === 'Healthcare') opportunities.push('Government push for innovation in this sector');
  if (opportunities.length < 3) opportunities.push('Growing middle class driving demand for quality products/services');

  if (data.alternatives) threats.push(`Existing alternatives (${data.alternatives}) may have established customer base`);
  threats.push('Economic slowdown could impact consumer spending');
  if (data.industry === 'Food & Beverage' || data.industry === 'Healthcare') threats.push('Stringent regulatory requirements may increase compliance costs');
  if (threats.length < 3) threats.push('Price-sensitive Indian market may resist premium pricing');

  const risks = [
    {
      risk: 'Market Adoption Risk',
      impact: 'High',
      mitigation: `Start with a focused MVP targeting ${data.targetCustomer || 'early adopters'} in ${data.city || 'target city'} before expanding.`,
    },
    {
      risk: 'Cash Flow Risk',
      impact: monthlyProfit < 0 ? 'Critical' : 'Medium',
      mitigation: `Maintain ${Math.ceil(breakEven * 1.5)} months of runway. Consider ${data.fundingSource || 'alternative funding'} to bridge gaps.`,
    },
    {
      risk: 'Competition Risk',
      impact: data.alternatives ? 'High' : 'Medium',
      mitigation: 'Focus on unique value proposition and build switching costs through superior customer experience.',
    },
    {
      risk: 'Operational Risk',
      impact: 'Medium',
      mitigation: `Build redundancy in ${data.rawMaterials ? 'supply chain' : 'key processes'} and establish SOPs early.`,
    },
  ];

  let recommendation;
  if (viabilityScore >= 75) recommendation = 'Highly Viable — Strong fundamentals suggest this business has excellent potential. Proceed with confidence.';
  else if (viabilityScore >= 50) recommendation = 'Viable with Caution — The business shows promise but has areas that need strengthening. Address key risks before scaling.';
  else recommendation = 'Needs Rework — Significant challenges exist. Revisit the business model, pricing, or market approach before proceeding.';

  return {
    executiveSummary: `${data.businessName || 'This business'} is a ${data.businessModel || 'B2C'} venture in the ${data.industry || 'general'} sector, based in ${data.city || 'India'}${data.state ? `, ${data.state}` : ''}. The business aims to address ${data.painPoint || 'key market needs'} with an initial investment of ₹${investment.toLocaleString('en-IN')}. With projected monthly revenue of ₹${revenue.toLocaleString('en-IN')} and operating costs of ₹${costs.toLocaleString('en-IN')}, the expected break-even is ${breakEven} months. The overall viability score is ${viabilityScore}/100.`,
    margin: Math.round(margin * 10) / 10,
    monthlyProfit,
    projections,
    viabilityScore,
    strengths,
    weaknesses,
    opportunities,
    threats,
    risks,
    recommendation,
  };
}

const inputClass = 'w-full rounded-lg border border-surface-border bg-surface-light px-4 py-2.5 text-slate-100 placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand';
const labelClass = 'block text-sm font-medium text-slate-300 mb-1.5';

export default function ReportIntake() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState(INITIAL_DATA);
  const [saving, setSaving] = useState(false);
  const [reportId, setReportId] = useState(id || null);

  useEffect(() => {
    if (id) {
      supabase
        .from('feasibility_reports')
        .select('*')
        .eq('id', id)
        .single()
        .then(({ data: report }) => {
          if (report) {
            setData({ ...INITIAL_DATA, ...report.data });
            setReportId(report.id);
          }
        });
    }
  }, [id]);

  function update(field, value) {
    setData((prev) => ({ ...prev, [field]: value }));
  }

  function updateFeature(index, value) {
    const next = [...data.features];
    next[index] = value;
    setData((prev) => ({ ...prev, features: next }));
  }

  function addFeature() {
    setData((prev) => ({ ...prev, features: [...prev.features, ''] }));
  }

  function removeFeature(index) {
    setData((prev) => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));
  }

  async function saveDraft() {
    setSaving(true);
    const payload = {
      user_id: user.id,
      title: data.businessName || 'Untitled Report',
      data,
      status: 'draft',
      updated_at: new Date().toISOString(),
    };

    if (reportId) {
      await supabase.from('feasibility_reports').update(payload).eq('id', reportId);
    } else {
      const { data: created } = await supabase.from('feasibility_reports').insert(payload).select('id').single();
      if (created) setReportId(created.id);
    }
    setSaving(false);
  }

  async function handleGenerate() {
    setSaving(true);
    const report = generateReport(data);
    const payload = {
      user_id: user.id,
      title: data.businessName || 'Untitled Report',
      data,
      report,
      status: 'complete',
      updated_at: new Date().toISOString(),
    };

    let targetId = reportId;
    if (reportId) {
      await supabase.from('feasibility_reports').update(payload).eq('id', reportId);
    } else {
      const { data: created } = await supabase.from('feasibility_reports').insert(payload).select('id').single();
      if (created) targetId = created.id;
    }
    setSaving(false);
    navigate(`/reports/${targetId}`);
  }

  function renderStep() {
    switch (step) {
      case 0:
        return (
          <div className="space-y-5">
            <div>
              <label className={labelClass}>Business Name</label>
              <input type="text" value={data.businessName} onChange={(e) => update('businessName', e.target.value)} className={inputClass} placeholder="e.g. FreshBasket India" />
            </div>
            <div>
              <label className={labelClass}>Industry / Sector</label>
              <select value={data.industry} onChange={(e) => update('industry', e.target.value)} className={inputClass}>
                <option value="">Select industry</option>
                {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Business Model</label>
              <select value={data.businessModel} onChange={(e) => update('businessModel', e.target.value)} className={inputClass}>
                <option value="">Select model</option>
                {MODELS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>City</label>
                <input type="text" value={data.city} onChange={(e) => update('city', e.target.value)} className={inputClass} placeholder="Mumbai" />
              </div>
              <div>
                <label className={labelClass}>State</label>
                <input type="text" value={data.state} onChange={(e) => update('state', e.target.value)} className={inputClass} placeholder="Maharashtra" />
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-5">
            <div>
              <label className={labelClass}>Target Customer Description</label>
              <textarea rows={3} value={data.targetCustomer} onChange={(e) => update('targetCustomer', e.target.value)} className={`${inputClass} resize-none`} placeholder="e.g. Urban millennials aged 25-40 who prefer organic groceries..." />
            </div>
            <div>
              <label className={labelClass}>Estimated Market Size (₹)</label>
              <input type="number" value={data.marketSize} onChange={(e) => update('marketSize', e.target.value)} className={inputClass} placeholder="e.g. 50000000" />
            </div>
            <div>
              <label className={labelClass}>Customer Pain Point</label>
              <textarea rows={2} value={data.painPoint} onChange={(e) => update('painPoint', e.target.value)} className={`${inputClass} resize-none`} placeholder="What problem are you solving?" />
            </div>
            <div>
              <label className={labelClass}>Existing Alternatives / Competitors</label>
              <input type="text" value={data.alternatives} onChange={(e) => update('alternatives', e.target.value)} className={inputClass} placeholder="e.g. BigBasket, Zepto, local kirana stores" />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-5">
            <div>
              <label className={labelClass}>Product / Service Description</label>
              <textarea rows={3} value={data.productDescription} onChange={(e) => update('productDescription', e.target.value)} className={`${inputClass} resize-none`} placeholder="Describe your product or service in detail..." />
            </div>
            <div>
              <label className={labelClass}>Key Features</label>
              <div className="space-y-2">
                {data.features.map((f, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      value={f}
                      onChange={(e) => updateFeature(i, e.target.value)}
                      className={inputClass}
                      placeholder={`Feature ${i + 1}`}
                    />
                    {data.features.length > 1 && (
                      <button type="button" onClick={() => removeFeature(i)} className="rounded-lg border border-red-500/30 px-3 text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer">×</button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addFeature} className="text-sm text-brand-light hover:underline cursor-pointer">+ Add feature</button>
              </div>
            </div>
            <div>
              <label className={labelClass}>Raw Materials / Inputs Needed</label>
              <input type="text" value={data.rawMaterials} onChange={(e) => update('rawMaterials', e.target.value)} className={inputClass} placeholder="e.g. Fresh produce, packaging materials" />
            </div>
            <div>
              <label className={labelClass}>Production / Delivery Process</label>
              <textarea rows={2} value={data.deliveryProcess} onChange={(e) => update('deliveryProcess', e.target.value)} className={`${inputClass} resize-none`} placeholder="Describe how you'll produce and deliver..." />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-5">
            <div>
              <label className={labelClass}>Initial Investment Required (₹)</label>
              <input type="number" value={data.initialInvestment} onChange={(e) => update('initialInvestment', e.target.value)} className={inputClass} placeholder="e.g. 500000" />
            </div>
            <div>
              <label className={labelClass}>Monthly Operating Costs (₹)</label>
              <input type="number" value={data.monthlyCosts} onChange={(e) => update('monthlyCosts', e.target.value)} className={inputClass} placeholder="e.g. 150000" />
            </div>
            <div>
              <label className={labelClass}>Expected Revenue per Month (₹)</label>
              <input type="number" value={data.monthlyRevenue} onChange={(e) => update('monthlyRevenue', e.target.value)} className={inputClass} placeholder="e.g. 300000" />
            </div>
            <div>
              <label className={labelClass}>Break-even Timeline (months)</label>
              <input type="number" value={data.breakEvenMonths} onChange={(e) => update('breakEvenMonths', e.target.value)} className={inputClass} placeholder="e.g. 12" />
            </div>
            <div>
              <label className={labelClass}>Funding Source</label>
              <select value={data.fundingSource} onChange={(e) => update('fundingSource', e.target.value)} className={inputClass}>
                <option value="">Select funding source</option>
                {FUNDING_SOURCES.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-5">
            <div>
              <label className={labelClass}>Team Size</label>
              <input type="number" value={data.teamSize} onChange={(e) => update('teamSize', e.target.value)} className={inputClass} placeholder="e.g. 5" />
            </div>
            <div>
              <label className={labelClass}>Key Hires Needed</label>
              <input type="text" value={data.keyHires} onChange={(e) => update('keyHires', e.target.value)} className={inputClass} placeholder="e.g. CTO, Marketing Lead, Operations Manager" />
            </div>
            <div>
              <label className={labelClass}>Launch Timeline</label>
              <input type="text" value={data.launchTimeline} onChange={(e) => update('launchTimeline', e.target.value)} className={inputClass} placeholder="e.g. 3 months from funding" />
            </div>
            <div>
              <label className={labelClass}>Regulatory Requirements</label>
              <textarea rows={2} value={data.regulatoryRequirements} onChange={(e) => update('regulatoryRequirements', e.target.value)} className={`${inputClass} resize-none`} placeholder="e.g. FSSAI license, GST registration, Shop Act license" />
            </div>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-100 mb-2">
        {id ? 'Edit Report' : 'New Feasibility Report'}
      </h1>
      <p className="text-slate-400 mb-8">Fill in the details to generate your feasibility report.</p>

      <div className="mb-8 flex items-center gap-1">
        {STEPS.map((label, i) => (
          <div key={label} className="flex-1">
            <button
              type="button"
              onClick={() => setStep(i)}
              className={`w-full h-1.5 rounded-full transition-colors cursor-pointer ${i <= step ? 'bg-brand' : 'bg-surface-border'}`}
            />
            <p className={`mt-2 text-xs ${i === step ? 'text-brand-light font-medium' : 'text-slate-500'}`}>
              {label}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-surface-border bg-surface p-8">
        <h2 className="text-lg font-semibold text-slate-100 mb-6">{STEPS[step]}</h2>
        {renderStep()}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="rounded-lg border border-surface-border px-5 py-2.5 text-sm font-medium text-slate-300 hover:bg-surface-light transition-colors disabled:opacity-30 cursor-pointer"
        >
          Back
        </button>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={saveDraft}
            disabled={saving}
            className="rounded-lg border border-surface-border px-5 py-2.5 text-sm font-medium text-slate-300 hover:bg-surface-light transition-colors disabled:opacity-50 cursor-pointer"
          >
            {saving ? 'Saving...' : 'Save Draft'}
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
              className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-light transition-colors cursor-pointer"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleGenerate}
              disabled={saving}
              className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-light transition-colors disabled:opacity-50 cursor-pointer"
            >
              {saving ? 'Generating...' : 'Generate Report'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
