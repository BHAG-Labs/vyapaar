-- Yantra (formerly Vyapaar): marketplace of proprietary BHAG Labs AI agents +
-- curated business solutions, co-sold against each founder's feasibility report.
-- Hosted on BHAG Labs' own GCP project. See Notion:
--   BHAG Labs › Solutions › Yantra — AI Agents Marketplace + GCP Infra Plan.

create table if not exists public.ai_agents (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  tagline text,
  description text,
  category text not null,
  capabilities text[] default '{}',
  use_cases text[] default '{}',
  inputs text[] default '{}',
  outputs text[] default '{}',
  pricing_model text not null default 'per_use',     -- per_use | subscription | one_time
  price_inr integer,                                  -- price in INR (per use or per month)
  status text not null default 'available',           -- available | beta | coming_soon
  featured boolean default false,
  icon text,                                          -- emoji shorthand for the card
  accent text,                                        -- tailwind accent (terracotta/forest/ochre/...)
  gcp_service text,                                   -- which BHAG GCP service powers it
  endpoint text,                                      -- production endpoint when launched
  demo_url text,
  sample_output_url text,
  created_at timestamptz default now()
);

alter table public.ai_agents enable row level security;
create policy "Anyone can read ai agents" on public.ai_agents for select using (true);

-- Seed: BHAG Labs proprietary agents, sequenced for the $5k GCP credit window.
insert into public.ai_agents
  (slug, name, tagline, description, category, capabilities, use_cases, inputs, outputs,
   pricing_model, price_inr, status, featured, icon, accent, gcp_service)
values
('reel-forge', 'Reel Forge',
  'Turn a one-line idea into a 30-sec vertical video.',
  'Generates short-form vertical videos (Reels / Shorts / TikTok) from a brief. Scripts the hook, voices it with a cloned narrator, cuts to b-roll using stock + generated frames, and burns captions. Tuned on Indian D2C and SaaS launch reels.',
  'Video',
  array['Script generation','Voiceover (en-IN, hi-IN)','Auto b-roll','Captions','9:16 export'],
  array['Product launch reels','Founder vlogs from notes','Feasibility-report explainer videos'],
  array['Topic / brief','Brand colors','Optional logo','Tone (founder | hype | calm)'],
  array['MP4 (1080x1920)','SRT captions','Thumbnail PNG'],
  'per_use', 499, 'available', true, '🎬', 'terracotta',
  'Cloud Run (GPU L4) + Vertex AI Veo + Cloud Storage'),

('threadsmith', 'ThreadSmith',
  'Twitter / X threads that actually get read.',
  'Researches a topic across the live web, structures a 8–12 tweet thread with a strong hook, generates accompanying images, and schedules drops. Trained against high-engagement Indian-startup Twitter.',
  'Social Media',
  array['Live web research','Hook A/B variants','Image cards','Schedule via X API','Reply ladder'],
  array['Build founder audience','Launch announcements','Newsletter promotion'],
  array['Topic / angle','Voice samples (3 past tweets)','Target persona'],
  array['Markdown thread','PNG cards','Scheduled X drafts'],
  'subscription', 1499, 'available', true, '🧵', 'ochre',
  'Cloud Run + Vertex AI Gemini 1.5 + Cloud Tasks'),

('inkpress', 'InkPress',
  'Substack-ready longform from a single idea.',
  'Drafts a 1500–2500 word Substack issue with a researched angle, original framing, pull-quotes, and SEO title variants. Fits the Bazaar editorial voice when asked.',
  'Newsletter',
  array['Outline → draft','Original research synthesis','Pull-quote callouts','SEO titles','Cover image'],
  array['Weekly Substack issues','Founder newsletters','Investor updates'],
  array['Topic / thesis','Tone reference (1 past issue)','Length target'],
  array['Markdown post','Cover image PNG','5 title variants'],
  'subscription', 1999, 'available', true, '✒️', 'forest',
  'Cloud Run + Vertex AI Gemini 1.5 + Imagen + Cloud Storage'),

('linkpost', 'LinkPost',
  'LinkedIn posts that don''t sound like LinkedIn.',
  'Writes founder-voice LinkedIn posts with a strong narrative hook, paragraph rhythm tuned for the LinkedIn feed, and a soft CTA. Avoids the "humbled to announce" cliché.',
  'Social Media',
  array['Story-led hooks','Paragraph rhythm','Soft CTA','Comment-bait close','Hashtag pack'],
  array['Founder hiring posts','Customer wins','Fundraise announcements'],
  array['Bullet notes','Voice sample','Audience (investors / customers / talent)'],
  array['LinkedIn post text','3 alt hooks','Hashtag pack'],
  'per_use', 199, 'available', false, '💼', 'sage',
  'Cloud Run + Vertex AI Gemini 1.5'),

('seo-scribe', 'SEO Scribe',
  'Long-tail blog posts that rank.',
  'Picks long-tail keywords from your feasibility report, drafts 1200–1800 word SEO blog posts with schema-aware headings, internal-link suggestions, and meta descriptions.',
  'Marketing',
  array['Keyword pick (long-tail)','H2/H3 outline','Schema-friendly draft','Meta + slug','Internal-link map'],
  array['Programmatic SEO','Category landing pages','Comparison pages'],
  array['Domain','Feasibility report ID','Target geography'],
  array['Markdown post','Meta JSON','Internal link map'],
  'subscription', 2499, 'beta', false, '🔍', 'terracotta',
  'Cloud Run + Vertex AI Gemini 1.5 + Custom search index (GCS + Matching Engine)'),

('coldwave', 'ColdWave',
  'Cold emails that get a reply.',
  'Researches the prospect from a domain, drafts a 4-step cold sequence with a real opener, and warms the inbox via SMTP. Indian B2B tuned.',
  'Sales',
  array['Prospect research','4-step sequence','Inbox warmup','Reply detection','A/B subjects'],
  array['Founder-led sales','Investor outreach','Partnership emails'],
  array['ICP definition','Domain list','Sender mailbox'],
  array['Sequence drafts','Subject A/B','Reply analytics'],
  'subscription', 2999, 'beta', false, '📨', 'forest',
  'Cloud Run + Vertex AI Gemini 1.5 + Cloud SQL + Cloud Tasks'),

('marketmind', 'MarketMind',
  'Live market & competitor briefs in 90 seconds.',
  'Pulls live competitor pricing, news, and review sentiment for any sector + city combo from your feasibility report and writes a 2-page brief. Refreshes weekly.',
  'Research',
  array['Competitor scrape','Pricing diff','Review sentiment','Weekly refresh','PDF export'],
  array['Pre-launch market sizing','Pricing decisions','Investor due diligence'],
  array['Sector','City','Competitor URLs (optional)'],
  array['PDF brief','CSV pricing table','Sentiment scorecard'],
  'per_use', 799, 'beta', false, '📊', 'ochre',
  'Cloud Run + Vertex AI Gemini 1.5 + BigQuery + Cloud Scheduler'),

('deck-narrator', 'Deck Narrator',
  'Auto-narrates your Pitchwala deck.',
  'Takes a Pitchwala deck and produces a founder-voice 4-minute video walkthrough — script, voice, slide cuts, captions. Drop into investor inbox.',
  'Video',
  array['Slide-aware script','Voice clone (founder)','Slide → video cuts','Captions','MP4 export'],
  array['Investor outreach','Async standups','Y Combinator video'],
  array['Pitchwala deck ID','Founder voice sample (30s)','Tone'],
  array['MP4 (16:9)','SRT captions','Script PDF'],
  'per_use', 999, 'coming_soon', false, '🎤', 'terracotta',
  'Cloud Run (GPU L4) + Vertex AI Veo + Chirp TTS');

-- Co-sell: which agents to recommend for a given feasibility-report archetype.
-- Used by Yantra to surface "agents that fit your report" on the report view.
create table if not exists public.ai_agent_recommendations (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.ai_agents(id) on delete cascade,
  business_model text,                                -- B2B | B2C | B2B2C | D2C | Marketplace
  industry text,                                      -- nullable: matches any
  weight integer not null default 1,                  -- higher = stronger recommendation
  reason text
);

alter table public.ai_agent_recommendations enable row level security;
create policy "Anyone can read agent recommendations"
  on public.ai_agent_recommendations for select using (true);

-- Business models match the values in Yantra's ReportIntake form:
-- B2B, B2C, B2B2C, D2C, Marketplace.
insert into public.ai_agent_recommendations (agent_id, business_model, industry, weight, reason)
select a.id, v.bm, v.ind, v.w, v.reason from (values
  ('reel-forge',     'D2C',         null::text, 5, 'D2C lives or dies on short-form video. Reels / Shorts power your top-of-funnel.'),
  ('reel-forge',     'B2C',         null::text, 5, 'Consumer brands convert 2x faster with founder-face explainer reels.'),
  ('reel-forge',     'Marketplace', null::text, 3, 'Reels build supply-side awareness in tier-2/3 cities.'),
  ('threadsmith',    'B2B',         null::text, 5, 'B2B founders need a Twitter audience before they need a sales team.'),
  ('threadsmith',    'B2B2C',       null::text, 4, 'Hybrid models grow via founder-led Twitter narratives.'),
  ('threadsmith',    'Marketplace', null::text, 4, 'Twitter threads are how marketplaces tell their supply story.'),
  ('inkpress',       'B2B',         null::text, 5, 'Substack is the lowest-CAC channel for B2B in India right now.'),
  ('inkpress',       'B2B2C',       null::text, 4, 'B2B2C lives on category-defining longform.'),
  ('inkpress',       'Marketplace', null::text, 3, 'Marketplaces compound on weekly newsletters about their supply.'),
  ('linkpost',       'B2B',         null::text, 5, 'LinkedIn is where Indian B2B buyers are. Post 3x a week.'),
  ('linkpost',       'B2B2C',       null::text, 4, 'LinkedIn drives most B2B2C inbound in metros.'),
  ('seo-scribe',     'Marketplace', null::text, 5, 'Programmatic SEO is the cheapest moat a marketplace can build.'),
  ('seo-scribe',     'D2C',         null::text, 4, 'Long-tail SEO converts intent traffic at a fraction of meta CAC.'),
  ('seo-scribe',     'B2C',         null::text, 3, 'Category SEO compounds for consumer brands over 6 months.'),
  ('coldwave',       'B2B',         null::text, 5, 'Founder-led outbound is the fastest path to your first 10 B2B customers.'),
  ('coldwave',       'B2B2C',       null::text, 4, 'Cold email still works for high-ticket B2B2C deals.'),
  ('marketmind',     'D2C',         null::text, 4, 'Live competitor pricing is critical pre-launch in D2C.'),
  ('marketmind',     'B2C',         null::text, 4, 'Consumer pricing moves weekly. Track competitors automatically.'),
  ('marketmind',     'Marketplace', null::text, 4, 'Track supply-side competitors weekly.'),
  ('marketmind',     'B2B',         null::text, 3, 'Win-loss intelligence on B2B pricing pages.'),
  ('deck-narrator',  'B2B',         null::text, 3, 'Async investor outreach: send a video deck instead of begging for a call.'),
  ('deck-narrator',  'D2C',         null::text, 2, 'Founder-voice deck videos lift investor reply rates.'),
  ('deck-narrator',  'B2C',         null::text, 2, 'Investor outreach for D2C / B2C brands works better with video.')
) as v(slug, bm, ind, w, reason)
join public.ai_agents a on a.slug = v.slug;
