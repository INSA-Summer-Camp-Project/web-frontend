import React from "react";

// ─── Shared types ────────────────────────────────────────────────────────────

export interface LegalItem {
  text: string;
}

export interface LegalSection {
  heading: string;
  body: string;
  items?: LegalItem[];
  /** Optional note rendered below the bullet list */
  note?: string;
}

// ─── Section renderer ────────────────────────────────────────────────────────

interface LegalSectionBlockProps {
  section: LegalSection;
  index: number;
}

export const LegalSectionBlock: React.FC<LegalSectionBlockProps> = ({
  section,
  index,
}) => (
  <div className="mb-7 last:mb-0">
    <h3 className="font-serif text-base font-semibold text-ink mb-1.5">
      {index + 1}. {section.heading}
    </h3>

    <p className="text-sm text-ink-secondary leading-relaxed mb-2">
      {section.body}
    </p>

    {section.items && section.items.length > 0 && (
      <ul className="space-y-1.5 mb-2">
        {section.items.map((item, i) => (
          <li key={i} className="flex gap-2.5 text-sm text-ink-secondary">
            {/* Bullet uses primary colour to tie into the brand */}
            <span
              className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0"
              aria-hidden="true"
            />
            <span className="leading-relaxed">{item.text}</span>
          </li>
        ))}
      </ul>
    )}

    {section.note && (
      <p className="text-xs text-ink-muted leading-relaxed italic">
        {section.note}
      </p>
    )}
  </div>
);

// ─── Terms of Service data ────────────────────────────────────────────────────

export const TERMS_LAST_UPDATED = "January 1, 2025";

export const TERMS_INTRO =
  'These Terms of Service govern your access to and use of the ServiceHub platform, website, and related services (the "Service"). By creating an account or using the Service, you agree to be bound by these Terms. If you do not agree, do not use the Service.';

export const TERMS_SECTIONS: LegalSection[] = [
  {
    heading: "Acceptance of Terms",
    body: "By accessing or using ServiceHub you confirm that you are at least 18 years old, have the legal capacity to enter a binding agreement, and have read and understood these Terms. If you are acting on behalf of an organisation, you confirm you have authority to bind that organisation.",
  },
  {
    heading: "User Accounts",
    body: "ServiceHub uses Telegram for passwordless authentication. By signing in you authorise us to receive your Telegram public profile data (user ID, display name, and profile photo). You are solely responsible for all activity that occurs under your account.",
    items: [
      { text: "Do not share access to your account with others." },
      {
        text: "Notify us immediately at security@servicehub.app if you suspect unauthorised access.",
      },
      {
        text: "Accounts are personal and non-transferable without our written consent.",
      },
    ],
  },
  {
    heading: "Platform Rules",
    body: "To maintain a safe, trustworthy marketplace all users agree not to:",
    items: [
      { text: "Post false, misleading, or fraudulent listings or reviews." },
      {
        text: "Harass, threaten, or discriminate against other users in any form.",
      },
      {
        text: "Circumvent the platform to conduct transactions outside ServiceHub in order to avoid fees or accountability.",
      },
      {
        text: "Use bots, scrapers, or other automated tools without our express written permission.",
      },
      {
        text: "Impersonate any person or entity, or misrepresent your qualifications.",
      },
    ],
  },
  {
    heading: "Service Listings & Transactions",
    body: "ServiceHub is a marketplace that connects clients with service professionals. We are not a party to any agreement made between users and we do not guarantee the quality, safety, or legality of any service listed.",
    items: [
      {
        text: "Professionals are independent contractors, not employees of ServiceHub.",
      },
      {
        text: "Clients are solely responsible for evaluating professionals before hiring.",
      },
      {
        text: "Disputes between users must be resolved directly between the parties. ServiceHub may assist in mediation at its discretion.",
      },
    ],
  },
  {
    heading: "Fees & Payments",
    body: "Core access to ServiceHub is free. Any premium features or promoted listings will be clearly disclosed with their applicable fees before purchase. All fees are non-refundable unless otherwise stated or required by applicable law.",
  },
  {
    heading: "Intellectual Property",
    body: "All platform content -- logo, design, software, and graphics -- is owned by or licensed to ServiceHub and protected by applicable intellectual property laws. By submitting content to the platform you grant ServiceHub a non-exclusive, worldwide, royalty-free licence to display and distribute that content solely for the purpose of operating the Service.",
  },
  {
    heading: "Disclaimers",
    body: 'The Service is provided "as is" and "as available" without warranties of any kind, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not warrant that the Service will be uninterrupted, error-free, or completely secure.',
  },
  {
    heading: "Limitation of Liability",
    body: "To the fullest extent permitted by law, ServiceHub and its directors, employees, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of the platform. Our total liability for any claim shall not exceed the greater of $100 USD or the amount you paid to ServiceHub in the three months preceding the claim.",
  },
  {
    heading: "Termination",
    body: "We reserve the right to suspend or terminate your account at any time, with or without notice, for any violation of these Terms or conduct we deem harmful to the platform or its users. Upon termination your right to access the Service ceases immediately.",
  },
  {
    heading: "Governing Law & Changes",
    body: 'These Terms are governed by the laws of the applicable jurisdiction. We may revise these Terms at any time. Material changes will be communicated by updating the "Last updated" date above. Continued use of the Service after changes take effect constitutes your acceptance.',
    note: "Questions about these Terms? Contact us at legal@servicehub.app",
  },
];

// ─── Privacy Policy data ──────────────────────────────────────────────────────

export const PRIVACY_LAST_UPDATED = "January 1, 2025";

export const PRIVACY_INTRO =
  'ServiceHub ("we", "our", or "us") is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our platform. By using ServiceHub you agree to the practices described here.';

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    heading: "Information We Collect",
    body: "We collect information you provide directly and data generated automatically through your use of the platform:",
    items: [
      {
        text: "Account data: your Telegram user ID, display name, and profile photo as shared during authentication.",
      },
      {
        text: "Profile data: service categories, pricing, availability, and professional description you add to your profile.",
      },
      {
        text: "Usage data: pages viewed, features used, search queries, and session timestamps.",
      },
      {
        text: "Device data: IP address, browser type, operating system, and referral source.",
      },
      {
        text: "Communications: messages and ratings exchanged within ServiceHub (not your Telegram direct messages).",
      },
    ],
  },
  {
    heading: "How We Use Your Information",
    body: "We use the information we collect to:",
    items: [
      { text: "Create and maintain your account and profile." },
      {
        text: "Match clients with service professionals based on preferences and location.",
      },
      { text: "Facilitate communication between parties through Telegram." },
      { text: "Improve, personalise, and expand our platform features." },
      {
        text: "Send transactional notifications relevant to your bookings or account activity.",
      },
      { text: "Detect and prevent fraud, abuse, or security incidents." },
      { text: "Comply with applicable legal obligations." },
    ],
  },
  {
    heading: "Sharing Your Information",
    body: "We do not sell your personal information. We may share data only in these limited circumstances:",
    items: [
      {
        text: "With other users: your public profile (name, service category, rating) is visible to other platform users.",
      },
      {
        text: "With service providers: third-party vendors who help us operate the platform (e.g. hosting, analytics) under strict confidentiality agreements.",
      },
      {
        text: "For legal reasons: when required by law, court order, or government authority.",
      },
      {
        text: "Business transfers: in connection with a merger, acquisition, or sale of assets.",
      },
    ],
  },
  {
    heading: "Data Retention",
    body: "We retain your personal data for as long as your account is active or as needed to provide services. You may request deletion of your account and associated data at any time by contacting us. Some data may be retained for a limited period to comply with legal obligations or resolve disputes.",
  },
  {
    heading: "Your Rights",
    body: "Depending on your jurisdiction, you may have the following rights regarding your personal data:",
    items: [
      { text: "Access: request a copy of the data we hold about you." },
      {
        text: "Correction: request correction of inaccurate or incomplete data.",
      },
      {
        text: 'Deletion: request erasure of your personal data ("right to be forgotten").',
      },
      {
        text: "Portability: receive your data in a structured, machine-readable format.",
      },
      {
        text: "Objection: object to certain types of processing, including direct marketing.",
      },
    ],
    note: "To exercise any of these rights, contact us at privacy@servicehub.app",
  },
  {
    heading: "Cookies & Tracking",
    body: "We use cookies and similar technologies to maintain session state, remember your preferences, and analyse platform usage. You can control cookies through your browser settings; however, disabling them may affect some functionality.",
  },
  {
    heading: "Security",
    body: "We implement industry-standard security measures including encryption in transit (TLS), access controls, and regular security reviews. No system is completely secure and we cannot guarantee absolute security of your data.",
  },
  {
    heading: "Children's Privacy",
    body: "ServiceHub is not directed to children under 18. We do not knowingly collect personal information from anyone under 18. If you believe we have inadvertently collected such information, please contact us immediately at privacy@servicehub.app and we will delete it.",
  },
  {
    heading: "Changes to This Policy",
    body: 'We may update this Privacy Policy from time to time. We will notify you of material changes by updating the "Last updated" date at the top of this page. Continued use of the platform after changes constitutes acceptance of the updated policy.',
    note: "Questions about this Privacy Policy? Contact us at privacy@servicehub.app",
  },
];
