import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';

const CATEGORIES = ['All', 'Video', 'Social Media', 'Newsletter', 'Marketing', 'Sales', 'Research'];

const accentMap = {
  terracotta: 'border-terracotta/40 bg-terracotta/5 text-terracotta',
  forest: 'border-forest/40 bg-forest/5 text-forest',
  ochre: 'border-ochre/50 bg-ochre/10 text-charcoal',
  sage: 'border-sage/50 bg-sage/15 text-forest',
  rose: 'border-dusty-rose/60 bg-dusty-rose/20 text-charcoal',
};

const statusBadge = {
  available: 'bg-forest/10 text-forest border-forest/30',
  beta: 'bg-ochre/20 text-charcoal border-ochre/50',
  coming_soon: 'bg-charcoal/5 text-charcoal/60 border-charcoal/20',
};

const statusLabel = {
  available: 'Available',
  beta: 'Beta',
  coming_soon: 'Coming soon',
};

const pricingLabel = (model, price) => {
  if (price == null) return 'Talk to us';
  const inr = `₹${Number(price).toLocaleString('en-IN')}`;
  if (model === 'subscription') return `${inr} / month`;
  if (model === 'one_time') return `${inr} one-time`;
  return `${inr} / run`;
};

export default function Marketplace() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    supabase
      .from('ai_agents')
      .select('*')
      .order('featured', { ascending: false })
      .order('status', { ascending: true })
      .then(({ data }) => {
        setAgents(data || []);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    return agents.filter((a) => {
      if (category !== 'All' && a.category !== category) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!a.name.toLowerCase().includes(q) && !(a.tagline || '').toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [agents, category, search]);

  return (
    <div>
      <div className="mb-8 max-w-3xl">
        <p className="text-xs uppercase tracking-[0.2em] text-terracotta mb-2">BHAG Labs · Proprietary Agents</p>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-charcoal">AI Agent Marketplace</h1>
        <p className="text-charcoal/70 mt-3 text-base leading-relaxed">
          A curated catalog of AI agents we build, host, and run on our own GCP infrastructure.
          Plug them into the action plan from your feasibility report — content, video, outbound, research —
          and pay only for what you use.
        </p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer ${
                category === cat
                  ? 'bg-terracotta text-cream'
                  : 'border border-charcoal/15 text-charcoal/70 hover:bg-charcoal/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="sm:ml-auto">
          <input
            type="text"
            placeholder="Search agents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 rounded-lg border border-charcoal/15 bg-cream px-4 py-2 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-terracotta border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-charcoal/20 bg-cream p-12 text-center">
          <p className="text-charcoal/60">No agents match your filters yet. We ship a new one most weeks.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      )}

      <div className="mt-12 rounded-2xl border border-charcoal/15 bg-cream p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-terracotta mb-2">Want a custom agent?</p>
            <h3 className="font-heading text-2xl font-bold text-charcoal mb-2">We build private agents on our GCP infra.</h3>
            <p className="text-sm text-charcoal/70">
              Every agent above runs on BHAG Labs' own Google Cloud project — Cloud Run for the API,
              Vertex AI for the models, GCS for assets, Cloud Tasks for scheduling.
              We can clone any of these for your startup with your data and brand voice.
            </p>
          </div>
          <a
            href="mailto:agents@bhaglabs.com?subject=Custom%20agent%20enquiry"
            className="self-start rounded-lg bg-terracotta px-5 py-2.5 text-sm font-semibold text-cream hover:bg-terracotta/90 transition-colors"
          >
            Talk to BHAG Labs →
          </a>
        </div>
      </div>
    </div>
  );
}

function AgentCard({ agent }) {
  const accent = accentMap[agent.accent] || accentMap.terracotta;
  const isComingSoon = agent.status === 'coming_soon';

  return (
    <div className="group relative flex flex-col rounded-xl border border-charcoal/10 bg-cream p-6 hover:border-terracotta/40 hover:shadow-sm transition-all">
      {agent.featured && (
        <span className="absolute -top-2 right-4 rounded-full bg-ochre px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-charcoal">
          Featured
        </span>
      )}

      <div className="flex items-start gap-3 mb-3">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border text-2xl ${accent}`}>
          {agent.icon || '✨'}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-heading font-bold text-lg text-charcoal leading-tight">{agent.name}</h3>
            <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${statusBadge[agent.status] || statusBadge.available}`}>
              {statusLabel[agent.status] || agent.status}
            </span>
          </div>
          <p className="text-xs text-charcoal/50 mt-0.5">{agent.category}</p>
        </div>
      </div>

      {agent.tagline && (
        <p className="font-subheading text-base text-charcoal/90 italic mb-2">{agent.tagline}</p>
      )}
      <p className="text-sm text-charcoal/70 leading-relaxed mb-4 line-clamp-3">{agent.description}</p>

      {agent.capabilities?.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {agent.capabilities.slice(0, 4).map((c) => (
            <span key={c} className="rounded-md bg-charcoal/5 border border-charcoal/10 px-2 py-0.5 text-[11px] text-charcoal/70">
              {c}
            </span>
          ))}
          {agent.capabilities.length > 4 && (
            <span className="text-[11px] text-charcoal/50 px-1 py-0.5">+{agent.capabilities.length - 4} more</span>
          )}
        </div>
      )}

      <div className="mt-auto flex items-end justify-between gap-3 pt-3 border-t border-charcoal/10">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-charcoal/50">Pricing</p>
          <p className="text-sm font-semibold text-charcoal">{pricingLabel(agent.pricing_model, agent.price_inr)}</p>
        </div>
        <button
          disabled={isComingSoon}
          onClick={() => {
            if (isComingSoon) return;
            window.open(`mailto:agents@bhaglabs.com?subject=Run%20${encodeURIComponent(agent.name)}`, '_self');
          }}
          className={`rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
            isComingSoon
              ? 'bg-charcoal/5 text-charcoal/40 cursor-not-allowed'
              : 'bg-terracotta text-cream hover:bg-terracotta/90 cursor-pointer'
          }`}
        >
          {isComingSoon ? 'Notify me' : 'Run agent →'}
        </button>
      </div>
    </div>
  );
}
