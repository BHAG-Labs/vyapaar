// Legal pages for Yantra (the marketplace; this directory is named "vyapaar"
// for historical reasons but the public product is Yantra).
//
// Working draft. Have an Indian lawyer review before public launch.
// Applicable: DPDP Act 2023, IT Rules 2021, Consumer Protection Act 2019,
// Consumer Protection (E-Commerce) Rules 2020.

import { useParams } from 'react-router';

const PRODUCT = {
  name: 'Yantra',
  url: 'https://yantra.bhaglabs.com',
  contact: 'yantra@bhaglabs.com',
  description: 'a marketplace where Indian small and medium businesses discover and engage AI agents and business solutions',
};

const ENTITY = {
  name: 'BHAG Labs',
  legal: 'BHAG Labs (sole proprietorship of Kartikeya Sharma, pre-incorporation)',
  address: 'Delhi NCT, India',
  jurisdiction: 'Delhi, India',
};

const CONTACTS = {
  privacy: 'privacy@bhaglabs.com',
  grievance: 'grievance@bhaglabs.com',
  legal: 'legal@bhaglabs.com',
  security: 'security@bhaglabs.com',
  billing: 'billing@bhaglabs.com',
};

const GRIEVANCE_OFFICER = {
  name: 'Kartikeya Sharma',
  designation: 'Founder',
  email: CONTACTS.grievance,
  hours: 'Mon–Fri 10:00–18:00 IST',
};

const LAST_UPDATED = '1 May 2026';

function Page({ title, kicker, children }) {
  return (
    <article className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <div className="mb-8 pb-6 border-b border-charcoal/10">
        <p className="text-[11px] uppercase tracking-[0.2em] text-ochre mb-2">{kicker}</p>
        <h1 className="font-heading font-bold text-3xl md:text-5xl text-charcoal leading-tight">{title}</h1>
        <p className="text-xs text-charcoal/50 mt-3">Last updated: {LAST_UPDATED}</p>
      </div>
      <div className="prose prose-sm md:prose-base max-w-none text-charcoal/80 leading-relaxed space-y-5
                      [&_h2]:font-heading [&_h2]:font-bold [&_h2]:text-charcoal [&_h2]:text-xl [&_h2]:md:text-2xl [&_h2]:mt-10 [&_h2]:mb-3
                      [&_a]:text-terracotta [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:opacity-80
                      [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_li]:marker:text-ochre">
        {children}
      </div>
    </article>
  );
}

function Privacy() {
  return (
    <Page kicker="Privacy" title="Privacy Policy">
      <p>This policy explains what personal data {PRODUCT.name} collects, why, and the rights you have under India's Digital Personal Data Protection Act, 2023.</p>

      <h2>Who is the data fiduciary</h2>
      <p>{ENTITY.legal}, operating as {ENTITY.name} ({PRODUCT.name}). Privacy contact: <a href={`mailto:${CONTACTS.privacy}`}>{CONTACTS.privacy}</a>.</p>

      <h2>What we collect</h2>
      <ul>
        <li><strong>Account data</strong> — email, name, business name, GSTIN (optional, for invoicing).</li>
        <li><strong>Business reports</strong> — the inputs and outputs of AI-agent runs, marketplace listings if you are a partner, transaction records.</li>
        <li><strong>Payment metadata</strong> — billing email and payment-gateway transaction IDs. Card / bank details remain with the gateway.</li>
        <li><strong>Usage data</strong> — pages visited, features used, error reports.</li>
        <li><strong>Communications</strong> — messages you send to support.</li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To run the marketplace and AI-agent services you request.</li>
        <li>To process payments and issue GST invoices.</li>
        <li>To respond to support requests.</li>
        <li>To match you with relevant solution providers (only with your consent).</li>
        <li>To comply with applicable Indian law including tax and consumer-protection obligations.</li>
      </ul>

      <h2>What we do NOT do</h2>
      <ul>
        <li>We do not sell your data.</li>
        <li>We do not share your business reports with marketplace partners without your explicit action.</li>
        <li>We do not use your private business data to train external AI models.</li>
      </ul>

      <h2>Marketplace partners</h2>
      <p>When you engage a third-party partner through {PRODUCT.name}, we share with them only the information necessary to deliver the service you bought (typically: your business name, contact email, the brief you submitted). Each partner has its own privacy policy that governs how they handle that data; we vet partners but you are encouraged to review their terms.</p>

      <h2>Sub-processors</h2>
      <p>Supabase (database, Mumbai region), Resend or AWS SES (email), GCP (compute, Mumbai), Razorpay or Stripe (payments), one or more LLM providers when AI agents are invoked.</p>

      <h2>Your rights under the DPDP Act</h2>
      <ul>
        <li>Access, correction, erasure, withdraw consent.</li>
        <li>Grievance redressal — see <a href="/grievance">Grievance page</a>.</li>
      </ul>
      <p>Email <a href={`mailto:${CONTACTS.privacy}`}>{CONTACTS.privacy}</a>. We respond within 72 hours for erasure / consent-withdrawal, 7 days for others.</p>

      <h2>Retention</h2>
      <p>Account and business data is kept while your account is active. After deletion: a 30-day soft-delete grace period for your records, then permanent deletion. Tax-relevant invoices are retained for 8 years per the Income-tax Act.</p>

      <h2>Security</h2>
      <p>Encrypted in transit (TLS) and at rest. Vulnerability disclosure: <a href={`mailto:${CONTACTS.security}`}>{CONTACTS.security}</a> (or see <a href="/.well-known/security.txt">/.well-known/security.txt</a>).</p>

      <h2>Children</h2>
      <p>{PRODUCT.name} is not directed at users under 18.</p>

      <h2>Updates</h2>
      <p>Material changes notified by email.</p>

      <h2>Contact</h2>
      <p>Privacy: <a href={`mailto:${CONTACTS.privacy}`}>{CONTACTS.privacy}</a> · Grievance: <a href="/grievance">Grievance page</a>.</p>
    </Page>
  );
}

function Terms() {
  return (
    <Page kicker="Legal" title="Terms of Service">
      <p>These terms govern your use of {PRODUCT.name} (<a href={PRODUCT.url}>{PRODUCT.url}</a>).</p>

      <h2>1. The service</h2>
      <p>{PRODUCT.name} is {PRODUCT.description}, operated by {ENTITY.legal}. {PRODUCT.name} acts as an intermediary between buyers (SMBs) and partner solution providers; we do not directly deliver every listed solution unless explicitly stated.</p>

      <h2>2. Eligibility & accounts</h2>
      <p>You must be 18 or older and operate a registered business in India to transact on the marketplace as a buyer or partner. Keep your credentials secure.</p>

      <h2>3. Acceptable use</h2>
      <ul>
        <li>Do not list services you cannot legally provide in India.</li>
        <li>Do not use {PRODUCT.name} to defraud counterparties.</li>
        <li>Do not scrape, reverse-engineer, or attempt to disrupt the service.</li>
      </ul>

      <h2>4. Marketplace transactions</h2>
      <p>When you engage a partner through {PRODUCT.name}, the contract for that service is between you and the partner. {PRODUCT.name} facilitates discovery, matching, and (where applicable) payment. {PRODUCT.name} is not a party to the underlying service contract unless we explicitly state otherwise on the listing.</p>

      <h2>5. Refunds & disputes (E-Commerce Rules 2020)</h2>
      <p>If a partner does not deliver as agreed, raise a dispute via the in-platform dispute flow within 7 days. We will mediate and, where the dispute is upheld, refund the platform-collected fees. The partner's own refund policy (linked on their listing) governs the rest. For escalations, contact <a href={`mailto:${CONTACTS.grievance}`}>{CONTACTS.grievance}</a>.</p>

      <h2>6. AI-agent outputs</h2>
      <p>AI agents listed on {PRODUCT.name} generate outputs based on inputs you provide. Outputs may contain errors, hallucinations, or misleading framings. You are responsible for reviewing every output before relying on it for a business decision.</p>

      <h2>7. Your content</h2>
      <p>You retain ownership of business data you submit. By using the service you grant {ENTITY.name} (and the partner you engage) a limited licence to process the data to deliver what you asked for.</p>

      <h2>8. Our IP</h2>
      <p>The {PRODUCT.name} platform, brand, code, and templates are owned by {ENTITY.name}. Marketplace partner listings remain owned by the partners.</p>

      <h2>9. Pricing, taxes, invoices</h2>
      <p>All prices on {PRODUCT.name} are inclusive of applicable Indian taxes unless stated otherwise. GST invoices are issued via <a href={`mailto:${CONTACTS.billing}`}>{CONTACTS.billing}</a>.</p>

      <h2>10. Disclaimers</h2>
      <p>Service is provided "as is". Outcomes from any solution or AI agent are not guaranteed. {ENTITY.name} does not endorse any specific partner or AI output.</p>

      <h2>11. Limitation of liability</h2>
      <p>Total liability is limited to the amount paid to {ENTITY.name} (i.e. platform fees, not pass-through partner fees) in the preceding 12 months, or ₹1,000, whichever is greater. No indirect or consequential damages.</p>

      <h2>12. Termination</h2>
      <p>You may delete your account anytime, subject to settlement of outstanding obligations. We may suspend access for violations.</p>

      <h2>13. Governing law</h2>
      <p>Laws of India. Exclusive jurisdiction: courts at {ENTITY.jurisdiction}.</p>

      <h2>14. Changes</h2>
      <p>Material changes notified by email at least 14 days in advance.</p>

      <h2>15. Contact</h2>
      <p>Legal: <a href={`mailto:${CONTACTS.legal}`}>{CONTACTS.legal}</a> · Billing: <a href={`mailto:${CONTACTS.billing}`}>{CONTACTS.billing}</a> · General: <a href={`mailto:${PRODUCT.contact}`}>{PRODUCT.contact}</a></p>
    </Page>
  );
}

function Grievance() {
  return (
    <Page kicker="Compliance" title="Grievance Officer">
      <p>In compliance with the <strong>IT (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021</strong>, the <strong>DPDP Act 2023</strong>, and the <strong>Consumer Protection (E-Commerce) Rules, 2020</strong>, {ENTITY.name} ({PRODUCT.name}) designates a Grievance Officer.</p>

      <h2>Officer</h2>
      <p>
        <strong>{GRIEVANCE_OFFICER.name}</strong>, {GRIEVANCE_OFFICER.designation}<br />
        Email: <a href={`mailto:${GRIEVANCE_OFFICER.email}`}>{GRIEVANCE_OFFICER.email}</a><br />
        Address: {ENTITY.address}<br />
        Hours: {GRIEVANCE_OFFICER.hours}
      </p>

      <h2>What you can file</h2>
      <ul>
        <li>Marketplace disputes (non-delivery, misrepresentation, refund disputes).</li>
        <li>Takedown requests under Rule 3(1)(b) of the IT Rules.</li>
        <li>Reports of fraudulent or impersonating partner listings.</li>
        <li>DPDP complaints (access, correction, erasure, consent withdrawal).</li>
        <li>Account-suspension or moderation appeals.</li>
      </ul>

      <h2>How we respond</h2>
      <ul>
        <li><strong>Acknowledgement:</strong> within 48 hours (E-Commerce Rules requirement).</li>
        <li><strong>Resolution:</strong> within 1 month for E-Commerce-Rule grievances; 15 days for IT-Rules grievances; 72 hours for DPDP erasure / consent-withdrawal; 7 days for other DPDP requests.</li>
        <li><strong>Escalation:</strong> National Consumer Helpline (1915), the Data Protection Board of India once operational, or the Grievance Appellate Committee.</li>
      </ul>
    </Page>
  );
}

const PAGES = { privacy: Privacy, terms: Terms, grievance: Grievance };

export default function LegalPage({ kind }) {
  const params = useParams();
  const resolved = kind || params.kind;
  const Component = PAGES[resolved];
  if (!Component) {
    return (
      <Page kicker="404" title="Not found">
        <p>This legal page does not exist. Try <a href="/privacy">Privacy</a>, <a href="/terms">Terms</a>, or <a href="/grievance">Grievance</a>.</p>
      </Page>
    );
  }
  return <Component />;
}
