# Yantra

*यंत्र — instrument, machine, autonomous device.*

The BHAG Labs marketplace of proprietary AI agents and curated business solutions, co-sold against the action plan from each founder's feasibility report. Hosted on BHAG Labs' own GCP project.

- **Frontend:** React 19 + Vite + Tailwind v4 (editorial cream/charcoal/terracotta theme)
- **Backend:** Supabase (Auth + Postgres + RLS)
- **Agent runtime:** GCP — Cloud Run + Vertex AI + GCS + Cloud Tasks
- **Notion master plan:** `BHAG Labs › Solutions › Yantra — AI Agents Marketplace + GCP Infra Plan`

## Local dev

```bash
npm install
cp .env.example .env   # fill VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
npm run dev
```

