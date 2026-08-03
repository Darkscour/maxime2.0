import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Privacy Policy — Maxime",
  description:
    "How Maxime collects, uses, and shares personal information for collegiate and grassroots esports organizations in the United States.",
};

const LAST_UPDATED = "August 3, 2026";

export default function PrivacyPolicyPage() {
  return (
    <article className="relative overflow-hidden border-b border-[var(--border)] bg-spotlight">
      <div className="bg-grid bg-grid-fade absolute inset-0" aria-hidden />
      <Container className="relative py-16 sm:py-20">
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--accent)]">
          Legal
        </p>
        <h1 className="font-heading mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-[var(--foreground)] sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--foreground-muted)]">
          Last updated: {LAST_UPDATED}
        </p>

        <div className="prose-privacy mt-12 max-w-3xl space-y-10 text-sm leading-7 text-[var(--foreground-muted)]">
          <Section title="1. Introduction">
            <p>
              Maxime (“Maxime,” “we,” “us,” or “our”) provides an operating
              system for collegiate and grassroots esports organizations,
              including recruitment, sponsorship discovery, roster management,
              and related team tools (the “Service”). This Privacy Policy
              explains how we collect, use, disclose, and protect personal
              information when you visit our website or use the Service.
            </p>
            <p>
              This Policy is intended for users in the United States and is
              designed to align with applicable U.S. privacy laws, including the
              California Consumer Privacy Act as amended by the CPRA (“CCPA”)
              and similar state privacy statutes. By using the Service, you
              acknowledge the practices described here.
            </p>
          </Section>

          <Section title="2. Information We Collect">
            <p>We collect personal information in the following categories:</p>
            <h3 className="font-heading mt-6 text-base font-semibold text-[var(--foreground)]">
              Account and identity information
            </h3>
            <p>
              When you create an account, our authentication provider (Clerk)
              processes identifiers such as your email address, display name,
              password or single sign-on credentials, and optional multi-factor
              authentication details. We store a linked account record that may
              include your email, display name, account type (player or team
              manager), account tier (collegiate or grassroots), manager title,
              school or organization email addresses, and verification status.
            </p>
            <h3 className="font-heading mt-6 text-base font-semibold text-[var(--foreground)]">
              Profile and team information
            </h3>
            <p>
              Depending on how you use Maxime, you may provide player profile
              details (gaming handle, game, role, rank, region, school, age,
              hours played per week, bio, tags, and availability status) and
              team details (team name, school or institution, games, region,
              roster size, average viewers, Discord URL, invite codes, and team
              profile images). Managers may also submit notes related to
              sponsorship leads and outreach activity.
            </p>
            <h3 className="font-heading mt-6 text-base font-semibold text-[var(--foreground)]">
              Activity and communications within the Service
            </h3>
            <p>
              We process in-product activity such as profile views, watchlist
              entries, roster invites and join requests, duel-related messages,
              play-time logs, sponsorship lead status, and in-app notifications
              needed to operate those features.
            </p>
            <h3 className="font-heading mt-6 text-base font-semibold text-[var(--foreground)]">
              Device, cookie, and local storage data
            </h3>
            <p>
              We and our service providers use cookies and similar technologies.
              This includes session cookies from Clerk for authentication, a
              short-lived first-party cookie that remembers whether you intended
              to sign in or sign up, and browser storage used for onboarding
              drafts, homepage scroll position, and dashboard display
              preferences. We do not currently operate first-party advertising
              or analytics pixels on the Service.
            </p>
            <h3 className="font-heading mt-6 text-base font-semibold text-[var(--foreground)]">
              Institution directory data
            </h3>
            <p>
              We maintain a directory of U.S. collegiate institutions (for
              example, name, location, and domains) sourced from public datasets
              and enrichment services. That directory is general institutional
              metadata, not personal information about you, unless you
              voluntarily associate your profile or team with an institution.
            </p>
          </Section>

          <Section title="3. How We Use Information">
            <p>We use personal information to:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Create and secure accounts, and authenticate users</li>
              <li>
                Provide recruitment, scouting, roster, invite, duel, and
                sponsorship features
              </li>
              <li>
                Verify collegiate or organization affiliation where you submit
                school or org emails
              </li>
              <li>Store and display team profile images you upload</li>
              <li>
                Personalize the Service (for example, theme preferences) and
                improve reliability
              </li>
              <li>
                Communicate about the Service, security, and account-related
                notices
              </li>
              <li>
                Comply with law, enforce our terms, and protect Maxime, our
                users, and the public
              </li>
            </ul>
          </Section>

          <Section title="4. How We Share Information">
            <p>
              We do not sell personal information, and we do not share personal
              information for cross-context behavioral advertising as those
              terms are commonly defined under the CCPA.
            </p>
            <p className="mt-4">We disclose information to:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                <span className="text-[var(--foreground)]">Other users</span>,
                when you make profile or team information visible through
                scouting, invites, join requests, duels, or team pages
              </li>
              <li>
                <span className="text-[var(--foreground)]">Service providers</span>{" "}
                that process data on our behalf, including Clerk
                (authentication), Supabase / PostgreSQL (database hosting),
                Vercel Blob (image storage), and Logo.dev (institution logo
                display where used)
              </li>
              <li>
                <span className="text-[var(--foreground)]">
                  Professional advisors and authorities
                </span>{" "}
                when required by law or necessary to protect rights and safety
              </li>
              <li>
                <span className="text-[var(--foreground)]">
                  Successors in a business transaction
                </span>
                , such as a merger or acquisition, subject to appropriate
                safeguards
              </li>
            </ul>
          </Section>

          <Section title="5. Cookies and Similar Technologies">
            <p>
              Essential cookies and local storage are required for sign-in,
              session continuity, and basic product preferences. You can control
              cookies through your browser settings; disabling essential cookies
              may prevent you from using account features. Because we do not
              currently use advertising cookies, there is no separate “Do Not
              Sell or Share” cookie opt-out mechanism beyond the rights
              described below.
            </p>
          </Section>

          <Section title="6. Children’s Privacy">
            <p>
              The Service is directed to collegiate and grassroots esports
              participants and is not intended for children under 13. We do not
              knowingly collect personal information from children under 13. If
              you believe a child under 13 has provided us personal
              information, contact us and we will take appropriate steps to
              delete it. If you are between 13 and 17, use the Service only with
              a parent or guardian’s involvement where required by applicable
              law.
            </p>
          </Section>

          <Section title="7. Your Privacy Rights (United States)">
            <p>
              Depending on where you live, U.S. state privacy laws (including
              California’s CCPA/CPRA and comparable laws in states such as
              Virginia, Colorado, Connecticut, Utah, and others) may give you
              rights to:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                Know and access the personal information we collect about you
              </li>
              <li>Request deletion of personal information</li>
              <li>Request correction of inaccurate personal information</li>
              <li>
                Opt out of the “sale” or “sharing” of personal information (we
                do not sell or share personal information for targeted
                advertising)
              </li>
              <li>
                Limit use of sensitive personal information where applicable
              </li>
              <li>
                Receive equal service and price even if you exercise privacy
                rights (non-discrimination)
              </li>
            </ul>
            <p className="mt-4">
              To exercise these rights, contact us using the details in Section
              11. We will verify your request in a manner appropriate to the
              sensitivity of the request (for example, by confirming control of
              your account email). You may use an authorized agent where
              permitted by law. If we deny a request, you may appeal by replying
              to our decision with “Privacy Appeal” in the subject line.
            </p>
            <p className="mt-4">
              California residents may also designate an authorized agent and
              request disclosure of categories of personal information collected,
              sources, business purposes, and categories of third parties, as
              described in this Policy.
            </p>
          </Section>

          <Section title="8. Categories of Personal Information (CCPA Notice)">
            <p>
              In the past 12 months, depending on your use of Maxime, we may
              have collected the following CCPA categories: identifiers (such as
              name, email, account IDs); customer records information; protected
              classification characteristics if you choose to provide age;
              commercial or activity information related to Service usage;
              internet or electronic network activity (cookies, session data);
              geolocation-adjacent data at a coarse level (such as region you
              select); audio/visual or similar information only if you upload
              images; and professional or education-related information (school,
              institution, manager title). We collect this information from you
              directly, from your device, and from authentication and hosting
              providers. We use it for the business purposes in Section 3 and
              disclose it as described in Section 4.
            </p>
          </Section>

          <Section title="9. Retention and Security">
            <p>
              We retain personal information for as long as your account remains
              active or as needed to provide the Service, resolve disputes,
              enforce agreements, and meet legal obligations. When information
              is no longer needed, we delete or de-identify it in accordance
              with our practices.
            </p>
            <p className="mt-4">
              We use administrative, technical, and organizational measures
              designed to protect personal information, including access
              controls and encrypted connections. No method of transmission or
              storage is completely secure, and we cannot guarantee absolute
              security.
            </p>
          </Section>

          <Section title="10. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. The “Last
              updated” date at the top will change when we do. Material changes
              will be posted on this page and, where appropriate, communicated
              through the Service or email associated with your account.
            </p>
          </Section>

          <Section title="11. Contact Us">
            <p>
              For privacy questions, requests to exercise your rights, or
              appeals, contact Maxime through our{" "}
              <Link
                href="/coming-soon/contact"
                className="text-[var(--foreground)] underline underline-offset-4 transition-colors hover:text-[var(--accent)]"
              >
                Contact
              </Link>{" "}
              page and include “Privacy Request” in your message. You may also
              reach us at{" "}
              <a
                href="mailto:privacy@maxime.com"
                className="text-[var(--foreground)] underline underline-offset-4 transition-colors hover:text-[var(--accent)]"
              >
                maximetest138@gmail.com
              </a>
              .
            </p>
          </Section>
        </div>
      </Container>
    </article>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-heading text-xl font-semibold tracking-tight text-[var(--foreground)]">
        {title}
      </h2>
      <div className="mt-3 space-y-4">{children}</div>
    </section>
  );
}
