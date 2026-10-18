import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { DocSection, DocP, DocTable, DocCode, DocInlineCode } from "@/components/marketing/doc-content";

export const metadata = { title: "Architecture & Codebase Overview — Schoolum" };

export default function ArchitecturePage() {
  return (
    <MarketingPageShell
      eyebrow="Documentation — For developers"
      title="Architecture & Codebase Overview"
      description="How Schoolum is built, and how the codebase is organized."
    >
      <DocSection title="Tech stack">
        <DocTable
          headers={["Layer", "Choice"]}
          rows={[
            ["Framework", "Next.js 16 (App Router), React 19, TypeScript"],
            ["Database", "PostgreSQL via Prisma ORM"],
            ["Auth", "Auth.js (next-auth v5), JWT session strategy"],
            ["Styling", "Tailwind-style utility CSS"],
            ["Testing", "Vitest (unit/integration), Playwright (end-to-end)"],
            ["Hosting (reference deployment)", "Vercel + Neon Postgres"],
            ["Live classrooms", "LiveKit (SFU-based, not peer-to-peer)"],
            ["File storage", "Vercel Blob"],
            ["Email/SMS", "Provider-agnostic — Resend (email), Twilio / Sent.dm (SMS)"],
          ]}
        />
      </DocSection>

      <DocSection title="Multi-tenancy model">
        <DocP>
          Schoolum is one application instance serving many schools. Every tenant-scoped table carries a{" "}
          <DocInlineCode>schoolId</DocInlineCode>, and almost every database query is scoped to the current
          user&rsquo;s school at the service layer — a school never sees another school&rsquo;s data. A separate{" "}
          <strong>Super Admin</strong> role sits above all schools, for platform operators (plan catalog, platform
          billing, partner/buyer programs, per-school cost visibility).
        </DocP>
      </DocSection>

      <DocSection title="Authentication & session model">
        <DocP>
          Sessions are JWTs carrying only <DocInlineCode>{`{ id, role, schoolId }`}</DocInlineCode> — no
          student/guardian id. Staff and parents sign in with email + password. Students can sign in with{" "}
          <strong>school + admission number + password</strong> instead of an email, since many don&rsquo;t have
          one. Each portal page independently resolves the signed-in user&rsquo;s underlying record (e.g.{" "}
          <DocInlineCode>getStudentForUser</DocInlineCode>, <DocInlineCode>getGuardianForUser</DocInlineCode>) rather
          than trusting anything beyond the session&rsquo;s own user id — this is also what makes the &ldquo;view
          portal&rdquo; feature (below) safe.
        </DocP>
      </DocSection>

      <DocSection title="Role & permission system">
        <DocP>
          Default roles: School Owner, School Administrator, Head of School (Principal), Teacher,
          Accountant/Bursar, HR/Admin Staff, Librarian, Transport Manager, Parent, Student. Permissions are granular
          (e.g. <DocInlineCode>students.create</DocInlineCode>, <DocInlineCode>guardians.manage</DocInlineCode>) and{" "}
          <strong>configurable per school</strong> — a school owner or head of school can adjust what each role can
          do beyond the defaults. Every server action and page is gated with an explicit permission check, not just
          UI hiding.
        </DocP>
      </DocSection>

      <DocSection title='"View portal" access (notable pattern)'>
        <DocP>
          Owners, heads of school, and parents can open a student&rsquo;s portal read-only — to check grades,
          attendance, or assignments — without a second login and without ending their own session. This works via a
          signed, httpOnly, 30-minute cookie that is re-verified against the <em>current</em> session on every
          request (never trusted from its mere presence); mutating actions still resolve identity from the real
          session, so nothing can be done as the student being viewed.
        </DocP>
      </DocSection>

      <DocSection title="Core domains / modules">
        <DocTable
          headers={["Module", "Covers"]}
          rows={[
            ["People", "Students, staff, guardians, roles/permissions, bulk CSV import/export"],
            ["Academics", "Class groups/arms, subjects, timetabling, attendance"],
            ["Assessment", "Continuous assessment, report cards (custom per-school design), transcripts, a dedicated preschool assessment mode"],
            ["CBT", "Computer-based exams, AI-assisted question generation and grading, anti-cheating safeguards"],
            ["Online Learning", "Live classes (LiveKit), lecture/resource library, per-student progress tracking"],
            ["Finance", "Invoicing, optional fee items, online payment collection (each school connects its own gateway)"],
            ["Communication", "In-app notifications, branded email, SMS, parent/student/staff messaging, announcements with per-channel targeting"],
            ["Admissions", "Inquiry-to-enrollment pipeline"],
            ["Analytics", "School performance dashboards, AI-generated insights"],
            ["Partner Program", "Referral capture, commission engine, partner-facing dashboard"],
            ["Buyer Program", "Enterprise inquiry → agreement → invoicing flow"],
            ["Platform Admin", "Super Admin console: schools, plans, billing, partners, buyers, cost/margin visibility"],
          ]}
        />
      </DocSection>

      <DocSection title="Notification delivery">
        <DocP>
          A single engine (<DocInlineCode>notifyRecipients</DocInlineCode>) fans every event out to in-app, email,
          and SMS based on each recipient&rsquo;s preferences (email defaults on, SMS defaults off since it costs
          the school money). Email and SMS providers are resolved per school — a school&rsquo;s own connected
          provider is used if configured, otherwise email falls back to the platform&rsquo;s shared provider (SMS
          has no platform fallback, by design). All outbound email is rendered through one branded HTML template per
          school (logo, color), regardless of provider.
        </DocP>
      </DocSection>

      <DocSection title="Folder structure">
        <DocCode>{`src/
  app/
    (auth)/             # login, forgot/reset password, register
    dashboard/           # staff-facing app: students, staff, academics,
                          # results, attendance, finance, communication,
                          # data management, settings
    portal/student/      # student self-service portal
    portal/parent/       # parent self-service portal
    platform/            # Super Admin console
    partner/             # partner program pages
    api/                 # route handlers (webhooks, downloads, assets)
  lib/
    services/            # business logic & data access, one file per domain
    notification-delivery/  # email/SMS provider adapters + template renderer
    auth/                # session/permission guards
    permissions.ts       # permission keys, role labels, defaults
  components/             # shared UI (ui/, dashboard/, portal/, brand/)
prisma/
  schema.prisma           # full data model
  migrations/              # versioned SQL migrations
  seed/                    # demo data seeding`}</DocCode>
      </DocSection>

      <DocSection title="Testing">
        <DocP>
          Unit and integration tests run on Vitest; critical flows (enrollment, attendance, payments, exams) are
          additionally covered end-to-end with Playwright against a live instance.
        </DocP>
      </DocSection>
    </MarketingPageShell>
  );
}
