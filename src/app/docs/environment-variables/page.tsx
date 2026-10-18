import { Fragment } from "react";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { DocSection, DocP, DocList, DocTable, DocInlineCode } from "@/components/marketing/doc-content";

export const metadata = { title: "Environment Variables Reference — Schoolum" };

export default function EnvironmentVariablesPage() {
  return (
    <MarketingPageShell
      eyebrow="Documentation — For developers"
      title="Environment Variables & Configuration Reference"
      description={
        'Every variable below is read once at startup. Required variables are marked "Required"; everything else is optional — the related feature shows an honest "not configured" message instead of failing when left unset.'
      }
    >
      <DocSection title="Database">
        <DocTable
          headers={["Variable", "Required", "Description"]}
          rows={[
            [<DocInlineCode key="k">DATABASE_URL</DocInlineCode>, "Yes", "Pooled Postgres connection string, used by the running app."],
            [<DocInlineCode key="k">DIRECT_URL</DocInlineCode>, "Yes", "Direct (non-pooled) Postgres connection string, used for running migrations."],
          ]}
        />
      </DocSection>

      <DocSection title="Authentication">
        <DocTable
          headers={["Variable", "Required", "Description"]}
          rows={[
            [
              <DocInlineCode key="k">AUTH_SECRET</DocInlineCode>,
              "Yes",
              <Fragment key="d">Signing secret for sessions (Auth.js) and for the &ldquo;view portal&rdquo; access cookie. Generate with <DocInlineCode>openssl rand -base64 32</DocInlineCode>.</Fragment>,
            ],
            [<DocInlineCode key="k">NEXTAUTH_URL</DocInlineCode>, "Yes (dev)", "The app's own URL, used by Auth.js."],
          ]}
        />
      </DocSection>

      <DocSection title="App">
        <DocTable
          headers={["Variable", "Required", "Description"]}
          rows={[[<DocInlineCode key="k">APP_URL</DocInlineCode>, "Yes", "Public URL used to build links in emails/SMS and API callbacks."]]}
        />
      </DocSection>

      <DocSection title="Platform billing & payment security">
        <DocTable
          headers={["Variable", "Required", "Description"]}
          rows={[
            [
              <DocInlineCode key="k">PAYMENT_KEYS_SECRET</DocInlineCode>,
              "No",
              <Fragment key="d">
                Encrypts each school&rsquo;s own payment gateway keys at rest (AES-256-GCM). Falls back to{" "}
                <DocInlineCode>AUTH_SECRET</DocInlineCode> if unset — set a distinct value in production.
              </Fragment>,
            ],
            [
              <DocInlineCode key="k">PLATFORM_PAYSTACK_PUBLIC_KEY</DocInlineCode>,
              "No",
              <Fragment key="d">
                Your own Paystack merchant account, used to charge <strong>schools</strong> their Schoolum
                subscription. Separate from each school&rsquo;s own gateway (which they connect themselves, from
                Settings, to collect fees from parents).
              </Fragment>,
            ],
            [
              <DocInlineCode key="k">PLATFORM_PAYSTACK_SECRET_KEY</DocInlineCode>,
              "No",
              <Fragment key="d">
                Paired secret key. Webhook endpoint: <DocInlineCode>/api/webhooks/platform-paystack</DocInlineCode>.
              </Fragment>,
            ],
          ]}
        />
        <DocP>
          Left unset, platform billing falls back to a simulated &ldquo;Pay now → confirm&rdquo; flow — useful for
          demos and early setup.
        </DocP>
      </DocSection>

      <DocSection title="AI assistant & CBT AI features">
        <DocTable
          headers={["Variable", "Required", "Description"]}
          rows={[
            [<DocInlineCode key="k">OPENAI_API_KEY</DocInlineCode>, "No", "Enables the AI assistant and CBT AI features (question generation, exam insights, revision plans, grading suggestions) via OpenAI."],
            [<DocInlineCode key="k">ANTHROPIC_API_KEY</DocInlineCode>, "No", "Same features via Anthropic. Set either provider."],
            [<DocInlineCode key="k">AI_PROVIDER</DocInlineCode>, "No", <Fragment key="d"><DocInlineCode>openai</DocInlineCode> or <DocInlineCode>anthropic</DocInlineCode> when both keys are set. Defaults to <DocInlineCode>openai</DocInlineCode>.</Fragment>],
            [<Fragment key="k"><DocInlineCode>OPENAI_MODEL</DocInlineCode> / <DocInlineCode>ANTHROPIC_MODEL</DocInlineCode></Fragment>, "No", "Override the default model per provider."],
          ]}
        />
      </DocSection>

      <DocSection title="Online learning (live classes)">
        <DocTable
          headers={["Variable", "Required", "Description"]}
          rows={[
            [<DocInlineCode key="k">LIVEKIT_URL</DocInlineCode>, "No", "LiveKit Cloud or self-hosted server URL. Powers the native, embedded live classroom."],
            [
              <Fragment key="k"><DocInlineCode>LIVEKIT_API_KEY</DocInlineCode> / <DocInlineCode>LIVEKIT_API_SECRET</DocInlineCode></Fragment>,
              "No",
              <Fragment key="d">LiveKit credentials. Without these, &ldquo;Schedule Live Class&rdquo; still works; &ldquo;Start Class&rdquo; shows a &ldquo;not configured&rdquo; message.</Fragment>,
            ],
          ]}
        />
      </DocSection>

      <DocSection title="File storage">
        <DocTable
          headers={["Variable", "Required", "Description"]}
          rows={[[<DocInlineCode key="k">BLOB_READ_WRITE_TOKEN</DocInlineCode>, "No", "Vercel Blob token for lecture videos/documents and recordings — stored privately, served only through an authenticated route."]]}
        />
      </DocSection>

      <DocSection title="Live class recording (optional, on top of Online Learning)">
        <DocTable
          headers={["Variable", "Required", "Description"]}
          rows={[
            [<DocInlineCode key="k">RECORDING_S3_BUCKET</DocInlineCode>, "No", "S3-compatible bucket LiveKit Egress writes recordings to."],
            [<DocInlineCode key="k">RECORDING_S3_REGION</DocInlineCode>, "No", "Bucket region."],
            [
              <Fragment key="k"><DocInlineCode>RECORDING_S3_ACCESS_KEY</DocInlineCode> / <DocInlineCode>RECORDING_S3_SECRET_KEY</DocInlineCode></Fragment>,
              "No",
              <Fragment key="d">Bucket credentials. Without these, the &ldquo;Start recording&rdquo; control simply doesn&rsquo;t appear.</Fragment>,
            ],
          ]}
        />
      </DocSection>

      <DocSection title="Per-school configuration (not environment variables)">
        <DocP>These are set per school from inside the app, not in <DocInlineCode>.env</DocInlineCode>:</DocP>
        <DocList
          items={[
            "Email/SMS delivery provider and credentials (Settings → Notifications)",
            "Payment gateway for collecting fees from parents (Settings → Payments)",
            "Branding (logo, color) and report card design",
            "Role & permission configuration",
          ]}
        />
      </DocSection>
    </MarketingPageShell>
  );
}
