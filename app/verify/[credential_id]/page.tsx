"use client";

import { Suspense, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import {
  mapVerifyToCredentialProps,
  type VerifyCredentialData,
} from "@/lib/credentials";
import Credential from "@/components/orx/Credential";
import Certificate from "@/components/orx/Certificate";
import Badge from "@/components/orx/Badge";
import { Mark, Rise, SHELL, T } from "@/components/orx/kit";

function LinkedInIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M7 2v6.5M4.5 6.5 7 9l2.5-2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.5 11h9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <rect x="4.5" y="4.5" width="7.5" height="7.5" rx="1.2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M3 9.5V2.8A.8.8 0 0 1 3.8 2h6.7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M2.5 7.5 5.5 10.5 11.5 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BadgeSitePreview({ badge }: { badge: ReactNode }) {
  return (
    <div className="verify-site-preview" aria-hidden>
      <div className="verify-site-preview-bar">
        <span className="verify-site-preview-dot" />
        <span className="verify-site-preview-dot" />
        <span className="verify-site-preview-dot" />
        <span className="verify-site-preview-url">yourportfolio.dev</span>
      </div>
      <div className="verify-site-preview-page">
        <div className="verify-site-preview-nav">
          <span className="verify-site-sk verify-site-sk--sm" />
          <span className="verify-site-sk verify-site-sk--xs" />
          <span className="verify-site-sk verify-site-sk--xs" />
        </div>
        <div className="verify-site-preview-grid">
          <div className="verify-site-preview-copy">
            <span className="verify-site-sk verify-site-sk--title" />
            <span className="verify-site-sk verify-site-sk--line" />
            <span className="verify-site-sk verify-site-sk--line" />
            <span className="verify-site-sk verify-site-sk--line verify-site-sk--short" />
          </div>
          <div className="verify-site-preview-widget">{badge}</div>
        </div>
      </div>
      <p className="verify-site-preview-caption">On a portfolio or blog</p>
    </div>
  );
}

function EmbedBlock({
  label,
  code,
  copied,
  onCopy,
}: {
  label: string;
  code: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="verify-embed-block">
      <p className="orx-label" style={{ marginBottom: 8 }}>{label}</p>
      <div className="verify-embed-wrap">
        <button
          type="button"
          className="verify-embed-copy"
          aria-label={copied ? "Embed code copied" : "Copy embed code"}
          title={copied ? "Copied" : "Copy embed code"}
          onClick={onCopy}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
        <pre className="verify-embed-pre">{code}</pre>
      </div>
    </div>
  );
}

function VerifyContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const credentialId = params.credential_id as string;
  const view = searchParams.get("view");
  const embed = searchParams.get("embed");

  const [data, setData] = useState<VerifyCredentialData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [copiedBadgeEmbed, setCopiedBadgeEmbed] = useState(false);

  const verifyUrl = typeof window !== "undefined" ? window.location.href.split("?")[0] : "";
  const badgeEmbedUrl = verifyUrl ? `${verifyUrl}?embed=badge` : "";

  useEffect(() => {
    (async () => {
      try {
        const res = (await api.verify(credentialId)) as {
          success?: boolean;
          data?: VerifyCredentialData;
          error?: string;
        };
        if (!res?.success || !res.data) {
          setError(res?.error ?? "Credential not found");
          return;
        }
        setData(res.data);
      } catch (e) {
        setError(e instanceof ApiError ? e.message : "Credential not found or could not be verified");
      } finally {
        setLoading(false);
      }
    })();
  }, [credentialId]);

  useEffect(() => {
    if (view === "certificate" && data && !loading) {
      const t = window.setTimeout(() => window.print(), 400);
      return () => window.clearTimeout(t);
    }
  }, [view, data, loading]);

  const copyLink = async () => {
    if (!verifyUrl) return;
    await navigator.clipboard.writeText(verifyUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const copyEmbed = async (code: string, setter: (v: boolean) => void) => {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const shareLinkedIn = () => {
    if (!verifyUrl || !data) return;
    const props = mapVerifyToCredentialProps(data);
    const text = [
      `I earned my Orcred verification for ${props.project} — scored ${props.totalScore}/100.`,
      props.stack ? `Stack: ${props.stack}.` : "",
      `Verify: ${verifyUrl}`,
      "#Orcred #VerifiedEngineer",
    ]
      .filter(Boolean)
      .join("\n\n");
    const url = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=700");
  };

  const fullEmbedCode = verifyUrl
    ? `<iframe src="${verifyUrl}" width="420" height="640" frameborder="0" title="Orcred credential ${credentialId}"></iframe>`
    : "";

  const badgeEmbedCode = badgeEmbedUrl
    ? `<iframe src="${badgeEmbedUrl}" width="285" height="240" frameborder="0" title="Orcred badge ${credentialId}"></iframe>`
    : "";

  if (loading) {
    return (
      <p style={{ ...T.fine, textAlign: "center", padding: "80px 20px" }}>Verifying credential…</p>
    );
  }

  if (error || !data) {
    return (
      <div className="orx-card" style={{ padding: 48, textAlign: "center", maxWidth: 520, margin: "80px auto" }}>
        <p className="orx-label" style={{ color: "var(--err, #ba1a1a)", marginBottom: 12 }}>Not verified</p>
        <h1 style={{ ...T.title, fontSize: 28, marginBottom: 12 }}>Invalid credential</h1>
        <p style={{ ...T.lede, fontSize: 15 }}>{error}</p>
      </div>
    );
  }

  const props = mapVerifyToCredentialProps(data);
  const badgeWidth = 180; // 75% of prior 240px preview size

  const renderBadge = () => (
    <Badge project={props.project} stack={props.stack} id={props.id} caption={false} width={badgeWidth} />
  );

  if (embed === "badge") {
    return (
      <div className="orx" style={{ minHeight: "100vh", background: "var(--bg)", padding: 16 }}>
        <Badge project={props.project} stack={props.stack} id={props.id} caption={false} />
      </div>
    );
  }

  if (view === "certificate") {
    return (
      <div className="orx verify-print" style={{ minHeight: "100vh", background: "#fff", padding: "48px 24px 24px", display: "flex", justifyContent: "center" }}>
        <Certificate
          name={props.studentName}
          project={props.project}
          stack={props.stack}
          score={props.totalScore}
          date={props.issuedLabel}
          id={props.id}
          verifyUrl={verifyUrl}
          caption={false}
        />
      </div>
    );
  }

  return (
    <>
      <header className="no-print verify-header">
        <div className={`${SHELL} flex items-center justify-between gap-4`} style={{ paddingTop: 20, paddingBottom: 20 }}>
          <Link href="/" className="flex items-center gap-2.5" style={{ textDecoration: "none", color: "var(--ink)" }}>
            <Mark size={22} />
            <span style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 600, fontSize: 17, letterSpacing: "-0.02em" }}>
              Orcred
            </span>
          </Link>
          <span className="orx-label">Verified credential</span>
        </div>
      </header>

      <main className={`${SHELL} verify-main`}>
        <Rise now className="no-print" style={{ marginBottom: 28 }}>
          <p className="orx-label" style={{ marginBottom: 10 }}>Orcred verified engineer</p>
          <h1 style={{ ...T.title, fontSize: "clamp(28px, 5vw, 40px)", marginBottom: 10 }}>{props.studentName}</h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <p style={{ ...T.fine, margin: 0 }}>Issued {props.issuedLabel} · {props.id}</p>
            <span className="verify-live-pill">
              <span className="verify-live-dot" aria-hidden />
              Live & verified
            </span>
          </div>
        </Rise>

        <div className="verify-layout no-print">
          <Rise now delay={0.1} className="verify-credential-column">
            <div className="verify-credential-card-wrap">
              <Credential
                project={props.project}
                stack={props.stack}
                totalScore={props.totalScore}
                dimensions={props.dimensions}
                passed={props.passed}
                id={props.id}
                caption={false}
                brandVariant="icon"
              />
            </div>
          </Rise>

          <Rise now delay={0.22} className="verify-share-column orx-card">
            <div className="verify-share-inner">
              <p className="orx-label" style={{ marginBottom: 14 }}>Share</p>
              <div className="verify-share-actions">
                <button type="button" className="verify-share-btn verify-share-btn--linkedin" onClick={shareLinkedIn}>
                  <LinkedInIcon />
                  <span>Share on LinkedIn</span>
                </button>
                <div className="verify-share-row">
                  <button type="button" className="verify-share-btn verify-share-btn--copy" onClick={copyLink}>
                    {copiedLink ? <CheckIcon /> : <CopyIcon />}
                    <span>{copiedLink ? "Copied" : "Copy link"}</span>
                  </button>
                  <button
                    type="button"
                    className="verify-share-btn verify-share-btn--download"
                    onClick={() => window.open(`${verifyUrl}?view=certificate`, "_blank", "noopener,noreferrer")}
                  >
                    <DownloadIcon />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              <EmbedBlock
                label="Embed — full credential"
                code={fullEmbedCode}
                copied={copiedEmbed}
                onCopy={() => copyEmbed(fullEmbedCode, setCopiedEmbed)}
              />

              <p className="orx-label" style={{ marginTop: 16, marginBottom: 10 }}>Embed — compact badge</p>
              <div className="verify-badge-showcase">
                <div className="verify-badge-standalone">{renderBadge()}</div>
                <BadgeSitePreview
                  badge={<div className="verify-badge-in-site">{renderBadge()}</div>}
                />
              </div>

              <EmbedBlock
                label="Badge embed code"
                code={badgeEmbedCode}
                copied={copiedBadgeEmbed}
                onCopy={() => copyEmbed(badgeEmbedCode, setCopiedBadgeEmbed)}
              />
            </div>
          </Rise>
        </div>

        <Rise now delay={0.34} className="no-print">
        <p className="verify-trust-note" style={{ ...T.fine, marginTop: 16, lineHeight: 1.7 }}>
          Cryptographically signed and registered with Orcred. This credential cannot be edited or forged.
        </p>
        </Rise>

        <Rise now delay={0.42} className="no-print">
        <p style={{ ...T.fine, marginTop: 32, textAlign: "center", lineHeight: 1.7 }}>
          Every Orcred credential is earned through a live technical review — not a form, not a payment.
          <br />
          <Link href="/how-it-works" className="orx-link">How verification works →</Link>
        </p>
        </Rise>
      </main>

      <style jsx global>{`
        .verify-page {
          min-height: 100vh;
          background: var(--bg);
        }
        .verify-header {
          border-bottom: 1px solid var(--line);
          background: var(--surface);
        }
        .verify-main {
          padding-top: 40px;
          padding-bottom: 80px;
        }
        .verify-live-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 10px;
          border-radius: 999px;
          background: var(--or-soft);
          color: var(--or);
          font-size: 12px;
          font-weight: 500;
          letter-spacing: -0.005em;
        }
        .verify-live-dot {
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: var(--or);
          animation: verify-pulse 2.2s ease-in-out infinite;
        }
        @keyframes verify-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(0.82); }
        }
        @keyframes verify-shimmer {
          0% { background-position: 120% 0; }
          100% { background-position: -120% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .verify-live-dot,
          .verify-site-sk {
            animation: none;
          }
        }
        @media (min-width: 960px) {
          .verify-main {
            padding-top: 56px;
          }
        }
        .verify-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 28px;
          align-items: stretch;
        }
        @media (min-width: 960px) {
          .verify-layout {
            grid-template-columns: minmax(0, 1.45fr) minmax(0, 0.9fr);
            gap: 28px;
          }
        }
        .verify-credential-column,
        .verify-share-column {
          min-width: 0;
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .verify-credential-card-wrap {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }
        .verify-credential-card-wrap > div {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .verify-credential-card-wrap .orx-card {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .verify-credential-card-wrap .orx-card > div:nth-child(2) {
          flex: 1;
        }
        .verify-trust-note {
          max-width: 720px;
        }
        .verify-share-column {
          padding: 20px;
        }
        .verify-share-inner {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
          overflow-y: auto;
        }
        .verify-share-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }
        .verify-share-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .verify-share-btn {
          width: 100%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 11px 14px;
          font-family: var(--sans);
          font-size: 13.5px;
          font-weight: 500;
          letter-spacing: -0.01em;
          line-height: 1.2;
          text-transform: none;
          border-radius: var(--r);
          cursor: pointer;
          transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
        }
        .verify-share-row .verify-share-btn {
          font-size: 13px;
          padding: 11px 10px;
        }
        .verify-share-btn--linkedin {
          background: #0a66c2;
          color: #ffffff;
          border: 1px solid #0a66c2;
          box-shadow: 0 6px 16px -8px rgba(10, 102, 194, 0.55);
        }
        .verify-share-btn--linkedin span,
        .verify-share-btn--linkedin svg {
          color: #ffffff;
          fill: #ffffff;
        }
        .verify-share-btn--linkedin:hover {
          background: #004182;
          border-color: #004182;
          color: #ffffff;
        }
        .verify-share-btn--linkedin:hover span,
        .verify-share-btn--linkedin:hover svg {
          color: #ffffff;
          fill: #ffffff;
        }
        .verify-share-btn--copy {
          background: var(--or);
          color: #fff;
          border: 1px solid var(--or);
          box-shadow: var(--sh-or);
        }
        .verify-share-btn--copy:hover {
          background: var(--or-hi);
          border-color: var(--or-hi);
        }
        .verify-share-btn--download {
          background: var(--surface);
          color: var(--ink);
          border: 1px solid var(--ink);
          box-shadow: none;
        }
        .verify-share-btn--download:hover {
          background: var(--bg-soft);
          border-color: var(--ink);
        }
        .verify-share-btn:active {
          transform: translateY(1px);
        }
        .verify-embed-block {
          margin-bottom: 4px;
        }
        .verify-embed-wrap {
          position: relative;
        }
        .verify-embed-copy {
          position: absolute;
          top: 5px;
          right: 5px;
          z-index: 2;
          width: 22px;
          height: 22px;
          padding: 0;
          border: 1px solid rgba(16, 17, 20, 0.07);
          border-radius: 5px;
          background: rgba(255, 255, 255, 0.55);
          backdrop-filter: blur(6px);
          color: var(--ink-4);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow: none;
          transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
        }
        .verify-embed-copy svg {
          width: 12px;
          height: 12px;
          opacity: 0.75;
        }
        .verify-embed-copy:hover {
          color: var(--ink-2);
          border-color: rgba(16, 17, 20, 0.12);
          background: rgba(255, 255, 255, 0.82);
        }
        .verify-embed-copy:hover svg {
          opacity: 1;
        }
        .verify-embed-pre {
          font-size: 10.5px;
          line-height: 1.5;
          background: var(--bg-soft);
          padding: 10px 34px 10px 12px;
          overflow: auto;
          white-space: pre-wrap;
          word-break: break-all;
          border-radius: 8px;
          margin: 0;
          border: 1px solid var(--line);
          max-height: 120px;
        }
        .verify-badge-showcase {
          display: grid;
          grid-template-columns: minmax(0, 180px) minmax(0, 1fr);
          gap: 10px;
          align-items: start;
          margin-bottom: 12px;
        }
        .verify-badge-standalone {
          min-width: 0;
        }
        .verify-site-preview {
          min-width: 0;
          border: 1px solid var(--line);
          border-radius: 10px;
          overflow: hidden;
          background: var(--surface);
        }
        .verify-site-preview-bar {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 7px 10px;
          border-bottom: 1px solid var(--line);
          background: var(--bg-soft);
        }
        .verify-site-preview-dot {
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: var(--line-2);
          flex-shrink: 0;
        }
        .verify-site-preview-url {
          margin-left: 4px;
          font-size: 9px;
          font-weight: 500;
          color: var(--ink-4);
          letter-spacing: 0.02em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .verify-site-preview-page {
          padding: 10px;
        }
        .verify-site-preview-nav {
          display: flex;
          gap: 6px;
          margin-bottom: 10px;
        }
        .verify-site-preview-grid {
          display: grid;
          grid-template-columns: 1fr 72px;
          gap: 8px;
          align-items: start;
        }
        .verify-site-preview-copy {
          display: flex;
          flex-direction: column;
          gap: 5px;
          padding-top: 2px;
        }
        .verify-site-preview-widget {
          min-width: 0;
          overflow: hidden;
          height: 70px;
        }
        .verify-badge-in-site {
          transform: scale(0.38);
          transform-origin: top left;
          width: 180px;
          pointer-events: none;
        }
        .verify-site-sk {
          display: block;
          height: 5px;
          border-radius: 999px;
          background: linear-gradient(
            90deg,
            var(--line) 0%,
            rgba(255, 255, 255, 0.55) 45%,
            var(--line) 90%
          );
          background-size: 220% 100%;
          animation: verify-shimmer 2.6s ease-in-out infinite;
        }
        .verify-site-sk--title {
          height: 7px;
          width: 88%;
          margin-bottom: 2px;
        }
        .verify-site-sk--line {
          width: 100%;
        }
        .verify-site-sk--short {
          width: 62%;
        }
        .verify-site-sk--sm {
          width: 28px;
          height: 4px;
        }
        .verify-site-sk--xs {
          width: 18px;
          height: 4px;
          opacity: 0.7;
        }
        .verify-site-preview-caption {
          margin: 0;
          padding: 6px 10px 8px;
          font-size: 9.5px;
          font-weight: 500;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--ink-4);
          border-top: 1px solid var(--line);
          background: var(--bg-soft);
        }
        @media print {
          .no-print { display: none !important; }
          .verify-print { padding: 0 !important; }
        }
      `}</style>
    </>
  );
}

export default function VerifyCredentialPage() {
  return (
    <div className="orx verify-page">
      <Suspense fallback={<p style={{ textAlign: "center", padding: 80 }}>Loading…</p>}>
        <VerifyContent />
      </Suspense>
    </div>
  );
}
