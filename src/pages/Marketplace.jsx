import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';

const CATEGORIES = ['All', 'Logistics', 'Payments', 'Legal', 'Marketing', 'Technology', 'Manufacturing'];

const categoryColors = {
  Logistics: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Payments: 'bg-green-500/10 text-green-400 border-green-500/20',
  Legal: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Marketing: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  Technology: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  Manufacturing: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
};

export default function Marketplace() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    supabase
      .from('marketplace_partners')
      .select('*')
      .order('featured', { ascending: false })
      .then(({ data }) => {
        setPartners(data || []);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    return partners.filter((p) => {
      if (category !== 'All' && p.category !== category) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [partners, category, search]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100">Partner Marketplace</h1>
        <p className="text-slate-400 mt-1">Discover partners to accelerate your business</p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                category === cat
                  ? 'bg-brand text-white'
                  : 'border border-surface-border text-slate-400 hover:text-slate-200 hover:bg-surface-light'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="sm:ml-auto">
          <input
            type="text"
            placeholder="Search partners..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 rounded-lg border border-surface-border bg-surface-light px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-surface-border bg-surface p-12 text-center">
          <p className="text-slate-400">No partners found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((partner) => (
            <div
              key={partner.id}
              className="rounded-xl border border-surface-border bg-surface p-6 hover:border-brand/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {partner.logo_url ? (
                    <img src={partner.logo_url} alt={partner.name} className="h-10 w-10 rounded-lg object-cover" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand font-bold text-lg">
                      {partner.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-slate-100">{partner.name}</h3>
                    <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${categoryColors[partner.category] || 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                      {partner.category}
                    </span>
                  </div>
                </div>
                {partner.featured && (
                  <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-400">
                    Featured
                  </span>
                )}
              </div>

              <p className="text-sm text-slate-400 mb-4 line-clamp-2">{partner.description}</p>

              {partner.services?.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-1.5">
                  {partner.services.map((s) => (
                    <span key={s} className="rounded-md bg-surface-light border border-surface-border px-2 py-0.5 text-xs text-slate-400">
                      {s}
                    </span>
                  ))}
                </div>
              )}

              {partner.cities?.length > 0 && (
                <p className="text-xs text-slate-500 mb-4">{partner.cities.join(', ')}</p>
              )}

              <div className="flex gap-2">
                {partner.website && (
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 rounded-lg border border-surface-border px-3 py-2 text-center text-sm font-medium text-slate-300 hover:bg-surface-light transition-colors"
                  >
                    Website
                  </a>
                )}
                {partner.contact_email ? (
                  <a
                    href={`mailto:${partner.contact_email}`}
                    className="flex-1 rounded-lg bg-brand/10 border border-brand/20 px-3 py-2 text-center text-sm font-medium text-brand-light hover:bg-brand/20 transition-colors"
                  >
                    Contact
                  </a>
                ) : (
                  <button
                    onClick={() => partner.website && window.open(partner.website, '_blank')}
                    className="flex-1 rounded-lg bg-brand/10 border border-brand/20 px-3 py-2 text-center text-sm font-medium text-brand-light hover:bg-brand/20 transition-colors cursor-pointer"
                  >
                    Learn More
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
