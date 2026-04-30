create table if not exists public.feasibility_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  data jsonb not null default '{}',
  report jsonb,
  status text not null default 'draft',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.feasibility_reports enable row level security;
create policy "Users manage own reports" on public.feasibility_reports for all using (user_id = auth.uid());

create table if not exists public.marketplace_partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  description text,
  services text[],
  cities text[],
  website text,
  contact_email text,
  logo_url text,
  featured boolean default false,
  created_at timestamptz default now()
);
alter table public.marketplace_partners enable row level security;
create policy "Anyone can read partners" on public.marketplace_partners for select using (true);

insert into public.marketplace_partners (name, category, description, services, cities, website, featured) values
('ShipRocket', 'Logistics', 'Multi-carrier shipping aggregator for ecommerce', array['Shipping', 'Fulfillment', 'COD'], array['Pan-India'], 'https://shiprocket.in', true),
('Razorpay', 'Payments', 'Payment gateway for Indian businesses', array['Payment Gateway', 'Subscriptions', 'Payouts'], array['Pan-India'], 'https://razorpay.com', true),
('Vakilsearch', 'Legal', 'Online legal services platform', array['Company Registration', 'Trademark', 'Compliance'], array['Pan-India'], 'https://vakilsearch.com', false),
('WebEngage', 'Marketing', 'Customer engagement and retention platform', array['Email Marketing', 'Push Notifications', 'Analytics'], array['Pan-India'], 'https://webengage.com', false),
('IndiaMART', 'Manufacturing', 'B2B marketplace for suppliers and manufacturers', array['Sourcing', 'Bulk Orders', 'Supplier Discovery'], array['Pan-India'], 'https://indiamart.com', true),
('Zoho', 'Technology', 'Business software suite', array['CRM', 'Accounting', 'HR', 'Project Management'], array['Pan-India'], 'https://zoho.com', true);
