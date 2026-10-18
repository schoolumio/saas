import Link from "next/link";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { DocSection, DocP, DocList, DocChecklist, DocCode, DocTable, DocInlineCode } from "@/components/marketing/doc-content";

export const metadata = { title: "Installation & Deployment Guide — Schoolum" };

export default function InstallationGuidePage() {
  return (
    <MarketingPageShell
      eyebrow="Documentation — For developers"
      title="Installation & Deployment Guide"
      description="Deploy one instance of Schoolum — once live, it hosts unlimited schools under your own brand."
    >
      <DocSection title="Prerequisites">
        <DocList
          items={[
            "Node.js 20+ and npm",
            "A PostgreSQL database (Neon, Supabase, RDS, or any Postgres 14+ instance)",
            <>A hosting target for a Next.js app (Vercel is used in this guide; any Node.js host works)</>,
          ]}
        />
      </DocSection>

      <DocSection title="1. Install dependencies">
        <DocCode language="bash">{`git clone <your-repo-url>\ncd schoolum\nnpm install`}</DocCode>
      </DocSection>

      <DocSection title="2. Provision the database">
        <DocP>Create a Postgres database and note two connection strings:</DocP>
        <DocList
          items={[
            "A pooled connection (for the running app)",
            "A direct connection (for running migrations — required for Vercel-style serverless deployments)",
          ]}
        />
        <DocP>
          Set these as <DocInlineCode>DATABASE_URL</DocInlineCode> and <DocInlineCode>DIRECT_URL</DocInlineCode>. See
          the <Link href="/docs/environment-variables" className="font-medium text-accent hover:underline">Environment Variables Reference</Link> for the full list.
        </DocP>
      </DocSection>

      <DocSection title="3. Set required environment variables">
        <DocP>At minimum:</DocP>
        <DocCode>{`DATABASE_URL=\nDIRECT_URL=\nAUTH_SECRET=       # generate with: openssl rand -base64 32\nAPP_URL=           # your deployed URL, e.g. https://app.yourschool.com`}</DocCode>
        <DocP>
          Everything else (payments, AI, live classes, file storage) is optional — each feature degrades gracefully
          with a clear &ldquo;not configured&rdquo; message instead of failing, so you can launch core features
          first and connect the rest later.
        </DocP>
      </DocSection>

      <DocSection title="4. Run database migrations">
        <DocCode language="bash">npx prisma migrate deploy</DocCode>
        <DocP>
          This applies the full schema (schools, users, students, academics, attendance, results, CBT, finance,
          communications, and the partner/buyer programs) in one pass.
        </DocP>
      </DocSection>

      <DocSection title="5. (Optional) Seed demo data">
        <DocCode language="bash">npx tsx prisma/seed/index.ts</DocCode>
        <DocP>Creates one demo school with sample students, staff, and records — useful for a sales demo or your own QA, not required for production.</DocP>
      </DocSection>

      <DocSection title="6. Deploy">
        <DocP>Push to your hosting provider (e.g. Vercel). Set the environment variables from step 3 in your hosting provider&rsquo;s dashboard.</DocP>
        <DocCode language="bash">{`npm run build\nnpm start`}</DocCode>
      </DocSection>

      <DocSection title="7. Create the first Super Admin and onboard a school">
        <DocP>The Super Admin role sits above individual schools — it manages the plan catalog, platform billing, and every school on the instance.</DocP>
        <DocList
          ordered
          items={[
            <>
              Create the first Super Admin account directly in the database, or use the seed script above for a demo
              account (see the{" "}
              <Link href="/docs/architecture" className="font-medium text-accent hover:underline">Architecture & Codebase Overview</Link>
              {" "}doc&rsquo;s Role & permission system section).
            </>,
            "Sign in and create your first school from the Super Admin area.",
            "Invite that school's owner — they complete onboarding (school profile, academic structure, branding) from there.",
          ]}
        />
      </DocSection>

      <DocSection title="Verifying the install">
        <DocChecklist
          items={[
            "You can sign in as Super Admin",
            "A school can be created and its owner can sign in",
            "A student can be enrolled and a guardian invited to the parent portal",
            "(If configured) a test email/SMS notification is delivered",
          ]}
        />
      </DocSection>

      <DocSection title="Optional integrations">
        <DocTable
          headers={["Feature", "Requires"]}
          rows={[
            ["Branded email delivery", "A Resend account (per-school or platform-wide fallback)"],
            ["SMS notifications", "A Twilio or Sent.dm account (per school)"],
            ["AI assistant & CBT AI features", "An OpenAI or Anthropic API key"],
            ["Live virtual classrooms", "A LiveKit Cloud or self-hosted LiveKit server"],
            ["Lecture/file uploads", "A Vercel Blob token"],
            ["Live class recording", "An S3-compatible bucket (works alongside LiveKit)"],
            ["School payment collection", "Each school connects its own Paystack/Flutterwave/Korapay account"],
            ["Platform billing (charging schools)", "Your own Paystack merchant account"],
          ]}
        />
        <DocP>
          Full variable names and behavior: see the{" "}
          <Link href="/docs/environment-variables" className="font-medium text-accent hover:underline">Environment Variables Reference</Link>.
        </DocP>
      </DocSection>
    </MarketingPageShell>
  );
}
