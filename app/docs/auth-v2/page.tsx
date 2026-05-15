import type { Metadata } from "next";
import DocLayout, { type SidebarSection } from "@/components/DocLayout";
import {
    SectionHeading,
    SubHeading,
    CodeBlock,
    EndpointCard,
    ParamTable,
    Callout,
} from "@/components/DocComponents";

export const metadata: Metadata = {
    title: "AuthV2 — SchoolSoft+ Developer",
    description:
        "In-depth documentation for AuthV2, the OAuth 2.0 PKCE-based authentication flow used by SchoolSoft's mobile apps. Covers the full flow, PKCE mechanics, token exchange, security model, and implementation guide.",
};

const sidebar: SidebarSection[] = [
    {
        title: "Overview",
        items: [
            { id: "introduction", label: "Introduction" },
            { id: "why-it-matters", label: "Why it matters" },
            { id: "comparison", label: "Web vs. Mobile auth" },
        ],
    },
    {
        title: "PKCE",
        items: [
            { id: "what-is-pkce", label: "What is PKCE?" },
            { id: "pkce-flow", label: "How PKCE works" },
            { id: "pkce-why-mobile", label: "Why PKCE for mobile?" },
        ],
    },
    {
        title: "AuthV2 Flow",
        items: [
            { id: "flow-overview", label: "Flow overview" },
            { id: "step-1-pkce", label: "Step 1 — Generate PKCE pair" },
            { id: "step-2-authorize", label: "Step 2 — Authorization request" },
            { id: "step-3-code", label: "Step 3 — Receive auth code" },
            { id: "step-4-token", label: "Step 4 — Token exchange" },
            { id: "step-5-use", label: "Step 5 — Use the token" },
            { id: "step-6-session", label: "Step 6 — Token → session cookie" },
        ],
    },
    {
        title: "Endpoints",
        items: [
            { id: "endpoint-initiate", label: "Initiate (v2)", badge: "POST" },
            { id: "endpoint-callback", label: "Callback (v2)", badge: "POST" },
            { id: "endpoint-token-refresh", label: "Token refresh (v2)", badge: "POST" },
            { id: "endpoint-login-legacy", label: "Login (legacy)", badge: "POST" },
            { id: "endpoint-token-legacy", label: "Token (legacy)", badge: "POST" },
            { id: "endpoint-refresh-legacy", label: "Refresh (legacy)", badge: "POST" },
            { id: "endpoint-session", label: "Session", badge: "GET" },
        ],
    },
    {
        title: "Implementation",
        items: [
            { id: "impl-pkce-utils", label: "PKCE utilities" },
            { id: "impl-full-example", label: "Full example" },
            { id: "impl-token-storage", label: "Token storage" },
        ],
    },
    {
        title: "Security",
        items: [
            { id: "security-model", label: "Security model" },
            { id: "security-what-not-stored", label: "What is NOT stored" },
        ],
    },
    {
        title: "Reference",
        items: [
            { id: "ref-pkce-params", label: "PKCE parameters" },
            { id: "ref-token-response", label: "Token response fields" },
        ],
    },
    {
        title: "Multi-language",
        items: [
            { id: "lang-typescript", label: "TypeScript" },
            { id: "lang-python",     label: "Python" },
            { id: "lang-curl",       label: "curl" },
            { id: "lang-go",         label: "Go" },
            { id: "lang-kotlin",     label: "Kotlin" },
            { id: "lang-swift",      label: "Swift" },
            { id: "lang-php",        label: "PHP" },
            { id: "lang-ruby",       label: "Ruby" },
            { id: "lang-csharp",     label: "C#" },
        ],
    },
];

const muted: React.CSSProperties = { color: "var(--muted)", lineHeight: 1.75, marginBottom: "0.75rem" };
const mutedLg: React.CSSProperties = { ...muted, fontSize: "1rem", maxWidth: "660px" };
const inlineCode: React.CSSProperties = {
    fontFamily: "var(--font-geist-mono, monospace)",
    color: "var(--accent)",
    fontSize: "0.875em",
    background: "var(--surface-raised)",
    padding: "1px 5px",
    borderRadius: "4px",
    border: "1px solid var(--border-subtle)",
};

function StepBadge({ n }: { n: number }) {
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: "1.5rem", height: "1.5rem", borderRadius: "50%",
            background: "var(--accent-subtle)", border: "1px solid var(--accent-border)",
            color: "var(--accent)", fontSize: "0.7rem", fontWeight: 700,
            flexShrink: 0, marginRight: "0.6rem",
        }}>{n}</span>
    );
}

export default function AuthV2Page() {
    return (
        <DocLayout sections={sidebar}>

            {/* ── Page title ── */}
            <div style={{ marginBottom: "2rem" }}>
                <div style={{
                    display: "inline-flex", alignItems: "center", gap: "0.4rem",
                    padding: "0.3rem 0.75rem", borderRadius: "999px",
                    background: "var(--accent-subtle)", border: "1px solid var(--accent-border)",
                    fontSize: "0.75rem", color: "var(--accent)", fontWeight: 600,
                    marginBottom: "1rem", letterSpacing: "0.02em",
                }}>
                    REVERSE ENGINEERED
                </div>
                <h1 style={{
                    fontSize: "clamp(1.75rem, 4vw, 2.25rem)", fontWeight: 800,
                    letterSpacing: "-0.03em", color: "var(--foreground)", marginBottom: "0.75rem",
                }}>
                    AuthV2
                </h1>
                <p style={mutedLg}>
                    AuthV2 is the <strong style={{ color: "var(--foreground)" }}>OAuth 2.0 Authorization Code flow with PKCE</strong> used
                    by SchoolSoft&apos;s mobile applications. It enables long-lived, token-based authentication
                    without ever storing raw credentials — exactly how the official SchoolSoft app avoids
                    asking you to log in every hour.
                </p>
            </div>

            <Callout type="info">
                AuthV2 was discovered through <strong>weeks of reverse engineering</strong> SchoolSoft&apos;s mobile app network
                traffic. This is <strong>not</strong> an officially documented API. Endpoints and parameters may change
                without notice.
            </Callout>

            {/* ── Introduction ── */}
            <SectionHeading id="introduction">Introduction</SectionHeading>
            <p style={muted}>
                SchoolSoft exposes two distinct authentication surfaces:
            </p>
            <ul style={{ ...muted, paddingLeft: "1.25rem" }}>
                <li style={{ marginBottom: "0.5rem" }}>
                    <strong style={{ color: "var(--foreground)" }}>Web authentication</strong> — Classic
                    session-based login using <code style={inlineCode}>JSESSIONID</code> cookies. Valid for
                    roughly one hour.
                </li>
                <li>
                    <strong style={{ color: "var(--foreground)" }}>Mobile authentication (AuthV2)</strong> — A
                    full <strong>OAuth 2.0 + PKCE</strong> flow that returns a long-lived Bearer token valid for
                    up to 30 days. This is what the official SchoolSoft app uses.
                </li>
            </ul>
            <p style={muted}>
                SchoolSoft+ uses AuthV2 to give apps and integrations the same long-lived access the official
                mobile app enjoys — without storing your password anywhere.
            </p>

            {/* ── Why it matters ── */}
            <SectionHeading id="why-it-matters">Why it matters</SectionHeading>
            <p style={muted}>
                Session-based authentication is fine for a browser tab you have open, but it falls apart for
                mobile apps and background services:
            </p>
            <ul style={{ ...muted, paddingLeft: "1.25rem" }}>
                <li style={{ marginBottom: "0.4rem" }}>
                    Sessions expire after ~1 hour, forcing the user to log in again.
                </li>
                <li style={{ marginBottom: "0.4rem" }}>
                    Background operations (schedule syncing, push notifications) break when the session
                    expires silently.
                </li>
                <li style={{ marginBottom: "0.4rem" }}>
                    Storing the username and password to re-authenticate automatically is a serious security
                    risk and defeats the purpose of session auth.
                </li>
            </ul>
            <p style={muted}>
                AuthV2 solves this by replacing the short-lived cookie with a <strong style={{ color: "var(--foreground)" }}>token
                that lives for 30 days</strong>. The token can be cached, refreshed, and revoked server-side — without
                the user ever re-entering their password.
            </p>

            {/* ── Comparison ── */}
            <SectionHeading id="comparison">Web vs. Mobile authentication</SectionHeading>
            <p style={muted}>
                Understanding the difference between the two auth systems helps clarify why AuthV2 exists.
            </p>

            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "1rem",
                marginBottom: "1.5rem",
            }}>
                {/* Web card */}
                <div style={{
                    padding: "1.25rem",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    background: "var(--surface)",
                }}>
                    <p style={{ margin: "0 0 0.6rem", fontWeight: 700, color: "var(--foreground)", fontSize: "0.875rem" }}>
                        Web (Session-based)
                    </p>
                    <ul style={{ ...muted, paddingLeft: "1.1rem", marginBottom: 0, fontSize: "0.875rem" }}>
                        <li>POST username + password</li>
                        <li>Server returns <code style={inlineCode}>JSESSIONID</code> cookie</li>
                        <li>Cookie expires in ~1 hour</li>
                        <li>Requires re-login after expiry</li>
                        <li>No token concept</li>
                    </ul>
                </div>

                {/* Mobile card */}
                <div style={{
                    padding: "1.25rem",
                    borderRadius: "8px",
                    border: "1px solid var(--accent-border)",
                    background: "var(--accent-subtle)",
                }}>
                    <p style={{ margin: "0 0 0.6rem", fontWeight: 700, color: "var(--accent)", fontSize: "0.875rem" }}>
                        Mobile (AuthV2 / PKCE)
                    </p>
                    <ul style={{ ...muted, paddingLeft: "1.1rem", marginBottom: 0, fontSize: "0.875rem" }}>
                        <li>POST credentials + PKCE challenge</li>
                        <li>Server returns short-lived auth code</li>
                        <li>Code is exchanged for Bearer token</li>
                        <li>Token valid for 30 days</li>
                        <li>Token can be refreshed silently</li>
                    </ul>
                </div>
            </div>

            <p style={muted}>
                AuthV2 can also <strong style={{ color: "var(--foreground)" }}>translate</strong> a Bearer token
                into a session cookie, giving you access to the full regular web API as well.
            </p>

            {/* ══════════════ PKCE ══════════════ */}
            <SectionHeading id="what-is-pkce">What is PKCE?</SectionHeading>
            <p style={muted}>
                <strong style={{ color: "var(--foreground)" }}>PKCE</strong> stands for{" "}
                <strong style={{ color: "var(--foreground)" }}>Proof Key for Code Exchange</strong>. It is an
                extension to OAuth 2.0 designed specifically to protect <em>public clients</em> — apps that
                cannot safely store a client secret (mobile apps, single-page apps, desktop apps).
            </p>
            <p style={muted}>
                Without PKCE, an attacker who intercepts the authorization code (for example via a
                misconfigured redirect URI) could immediately exchange it for a token. PKCE prevents this by
                requiring the original requester to prove they initiated the flow.
            </p>

            <SectionHeading id="pkce-flow">How PKCE works</SectionHeading>
            <p style={{ ...muted, marginBottom: "1rem" }}>
                PKCE adds a <em>temporary secret</em> to the standard OAuth code flow:
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
                {[
                    { n: 1, label: "Generate code_verifier", desc: "The app generates a cryptographically random string called the code_verifier. This is the raw secret — it never leaves the app at this stage." },
                    { n: 2, label: "Derive code_challenge", desc: "The app computes SHA-256(code_verifier) and Base64url-encodes the result. This is the code_challenge — a one-way hash that can be sent safely." },
                    { n: 3, label: "Send challenge to server", desc: "The authorization request includes the code_challenge and code_challenge_method=S256. The server stores the challenge alongside the pending auth request." },
                    { n: 4, label: "Receive authorization code", desc: "If credentials are valid, the server returns a short-lived, one-time-use authorization code." },
                    { n: 5, label: "Exchange code + verifier for token", desc: "The app sends the code and the original code_verifier. The server recomputes SHA-256(code_verifier) and checks it matches the stored challenge." },
                    { n: 6, label: "Token issued", desc: "If the hashes match, the server issues the access token. The code alone is useless without the verifier — even if intercepted." },
                ].map(({ n, label, desc }) => (
                    <div key={n} style={{
                        display: "flex", gap: "0.75rem", alignItems: "flex-start",
                        padding: "0.875rem 1rem",
                        borderRadius: "8px",
                        border: "1px solid var(--border)",
                        background: "var(--surface)",
                    }}>
                        <StepBadge n={n} />
                        <div>
                            <p style={{ margin: "0 0 0.2rem", fontWeight: 600, color: "var(--foreground)", fontSize: "0.875rem" }}>{label}</p>
                            <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.85rem", lineHeight: 1.6 }}>{desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            <CodeBlock
                language="typescript"
                code={`// Simplified PKCE pair generation
import crypto from "crypto";

function makePkcePair() {
  // 1. Generate a random 32-byte verifier, base64url-encoded
  const verifier = crypto
    .randomBytes(32)
    .toString("base64url"); // ~43 chars, no padding

  // 2. SHA-256 hash of the verifier, base64url-encoded
  const challenge = crypto
    .createHash("sha256")
    .update(verifier)
    .digest("base64url");

  return { verifier, challenge };
}

// Usage
const { verifier, challenge } = makePkcePair();
// challenge → sent to SchoolSoft (code_challenge)
// verifier  → kept secret, sent later during token exchange`}
            />

            <SectionHeading id="pkce-why-mobile">Why PKCE for mobile?</SectionHeading>
            <p style={muted}>
                Native mobile apps are <strong style={{ color: "var(--foreground)" }}>public clients</strong> — any
                secret baked into the app binary can be extracted by a determined attacker. Standard OAuth 2.0
                confidential clients rely on a <em>client_secret</em> that only the server and a trusted backend
                know. That model breaks down entirely for mobile apps.
            </p>
            <p style={muted}>
                PKCE replaces the static client secret with a <em>per-request</em> ephemeral secret. There is
                nothing permanent to steal from the binary. This is why the OAuth 2.0 Security Best Current
                Practice (RFC 9700) mandates PKCE for all public clients, and why SchoolSoft&apos;s mobile app uses it.
            </p>

            {/* ══════════════ AuthV2 Flow ══════════════ */}
            <SectionHeading id="flow-overview">AuthV2 flow overview</SectionHeading>
            <p style={muted}>
                The full AuthV2 flow from cold start to usable Bearer token:
            </p>

            <CodeBlock
                language="text"
                code={`App                             SchoolSoft server
 │                                     │
 │── makePkcePair() ─────────────────► │  (local, no network)
 │                                     │
 │── POST /rest-api/login/student ────►│  { username, password,
 │   /password                         │    code_challenge, client_id,
 │                                     │    redirect_uri, state, ... }
 │                                     │
 │◄── { code: "abc123" } ─────────────│  authorization code
 │                                     │
 │── POST /rest-api/login/token ──────►│  { clientId, grantType: "code",
 │                                     │    code, code_verifier }
 │                                     │
 │◄── { access_token, expires_in } ───│  Bearer token (30 days)
 │                                     │
 │── GET /rest-api/...  ──────────────►│  Authorization: Bearer <token>
 │                                     │
 │── (optional) token → session ──────►│  translate token to JSESSIONID
 │                                     │  for web API access`}
            />

            {/* Step 1 */}
            <SectionHeading id="step-1-pkce">Step 1 — Generate PKCE pair</SectionHeading>
            <p style={muted}>
                Before any network call, the client generates a fresh PKCE pair. The{" "}
                <code style={inlineCode}>code_verifier</code> must be kept in memory only — never logged,
                never persisted. The <code style={inlineCode}>code_challenge</code> is safe to send over the
                network because it is a one-way hash.
            </p>
            <CodeBlock
                language="typescript"
                code={`import crypto from "crypto";

export function makePkcePair(): { verifier: string; challenge: string } {
  const verifier = crypto.randomBytes(32).toString("base64url");
  const challenge = crypto
    .createHash("sha256")
    .update(verifier)
    .digest("base64url");
  return { verifier, challenge };
}`}
            />

            {/* Step 2 */}
            <SectionHeading id="step-2-authorize">Step 2 — Authorization request</SectionHeading>
            <p style={muted}>
                Send the user&apos;s credentials to SchoolSoft&apos;s password login endpoint, along with the
                PKCE challenge and OAuth parameters. This is the only point at which the raw password is used.
            </p>
            <CodeBlock
                language="typescript"
                code={`const STATE = crypto.randomBytes(16).toString("hex"); // CSRF protection

const authResponse = await fetch(
  \`https://sms.schoolsoft.se/\${school}/rest-api/login/student/password\`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      password,
      // PKCE
      code_challenge:        challenge,
      code_challenge_method: "S256",
      // OAuth 2.0
      client_id:    "eApp",         // SchoolSoft mobile app client
      redirect_uri: "eapp://login", // mobile deep-link URI
      response_type: "code",
      state:        STATE,
      orgid:        school,
    }),
  }
);

const data = await authResponse.json();
// data.code — the short-lived authorization code`}
            />

            <Callout type="warning">
                The <code>password</code> field is used <strong>once</strong> and then discarded.
                Never store it in memory longer than this single call.
            </Callout>

            {/* Step 3 */}
            <SectionHeading id="step-3-code">Step 3 — Receive the authorization code</SectionHeading>
            <p style={muted}>
                On a successful authorization request, SchoolSoft returns a JSON body containing a short-lived,
                one-time-use <code style={inlineCode}>code</code>. This code is valid for a very short window
                (seconds to minutes) and can only be used once.
            </p>
            <CodeBlock
                language="json"
                code={`{
  "code": "eyJhbGc...",
  "state": "a3f8d1...",
  "redirect_uri": "eapp://login"
}`}
            />
            <p style={muted}>
                Verify that the <code style={inlineCode}>state</code> in the response matches the value you
                sent in Step 2 before proceeding. A mismatch indicates a possible CSRF attempt.
            </p>

            {/* Step 4 */}
            <SectionHeading id="step-4-token">Step 4 — Token exchange</SectionHeading>
            <p style={muted}>
                Exchange the authorization code and the original <code style={inlineCode}>code_verifier</code>{" "}
                for a long-lived Bearer token. This is the core PKCE proof: SchoolSoft recomputes{" "}
                <code style={inlineCode}>SHA-256(code_verifier)</code> and checks it against the{" "}
                <code style={inlineCode}>code_challenge</code> stored in Step 2.
            </p>
            <CodeBlock
                language="typescript"
                code={`const tokenResponse = await fetch(
  \`https://sms.schoolsoft.se/\${school}/rest-api/login/token\`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      clientId:      "eApp",
      grantType:     "code",
      code:          data.code,    // from Step 3
      code_verifier: verifier,     // the original random secret from Step 1
    }),
  }
);

const token = await tokenResponse.json();
// {
//   access_token: "eyJhbGc...",
//   token_type:   "Bearer",
//   expires_in:   2592000,        // 30 days in seconds
// }`}
            />

            {/* Step 5 */}
            <SectionHeading id="step-5-use">Step 5 — Use the token</SectionHeading>
            <p style={muted}>
                Attach the Bearer token as an <code style={inlineCode}>Authorization</code> header on every
                subsequent API request. The token acts as your identity proof and replaces the need for a
                session cookie on the mobile API.
            </p>
            <CodeBlock
                language="typescript"
                code={`const schedule = await fetch(
  \`https://sms.schoolsoft.se/\${school}/rest-api/schedule/student/\${userId}\`,
  {
    headers: {
      Authorization: \`Bearer \${token.access_token}\`,
      "User-Agent":  "Schoolsoft+/1.0",
    },
  }
);`}
            />

            {/* Step 6 */}
            <SectionHeading id="step-6-session">Step 6 — Token → session cookie (optional)</SectionHeading>
            <p style={muted}>
                The Bearer token can be <strong style={{ color: "var(--foreground)" }}>translated into a
                traditional session cookie</strong>. This lets you access the full regular web API (including
                JSP-based HTML scraping endpoints) using the same AuthV2 token without a separate web login.
            </p>
            <CodeBlock
                language="typescript"
                code={`// POST to SchoolSoft's session endpoint with the Bearer token
const sessionRes = await fetch(
  \`https://sms.schoolsoft.se/\${school}/rest-api/login/session\`,
  {
    method: "POST",
    headers: {
      Authorization: \`Bearer \${token.access_token}\`,
      "Content-Type": "application/json",
    },
  }
);

// Extract the Set-Cookie headers → JSESSIONID, hash, usertype
const cookies = sessionRes.headers.getSetCookie();
// These cookies can now be used against the regular web API`}
            />
            <Callout type="info">
                This translation is what allows SchoolSoft+ to serve <strong>both</strong> the mobile API
                (Bearer token) <strong>and</strong> the web API (session cookie) from a single AuthV2 login.
            </Callout>

            {/* ══════════════ Endpoints ══════════════ */}
            <SectionHeading id="endpoint-initiate">POST /api/v2/initiate</SectionHeading>
            <p style={muted}>
                SchoolSoft+ server-side wrapper: generates a fresh PKCE pair, stores the verifier server-side,
                and initiates the authorization request against SchoolSoft. Returns the auth code to the caller.
            </p>
            <EndpointCard
                method="POST"
                path="/api/v2/initiate"
                description="Initiate an AuthV2 login. Generates PKCE pair internally and calls SchoolSoft's authorization endpoint."
                auth={false}
            >
                <ParamTable
                    title="JSON body"
                    rows={[
                        { name: "username", type: "string", required: true, description: "SchoolSoft username" },
                        { name: "password", type: "string", required: true, description: "SchoolSoft password (forwarded directly, never stored)" },
                        { name: "school",   type: "string", required: true, description: "School slug (e.g. engelska)" },
                    ]}
                />
                <CodeBlock language="json" code={`// 200 OK\n{ "code": "eyJhbGc...", "state": "a3f8d1..." }`} />
            </EndpointCard>

            <SectionHeading id="endpoint-callback">POST /api/v2/callback</SectionHeading>
            <p style={muted}>
                Completes the PKCE exchange. Accepts the authorization code returned from the initiation step
                and the stored <code style={inlineCode}>state</code>, then calls SchoolSoft&apos;s token endpoint
                with the internally stored <code style={inlineCode}>code_verifier</code>.
            </p>
            <EndpointCard
                method="POST"
                path="/api/v2/callback"
                description="Exchange the authorization code for a Bearer token. Must be called after /api/v2/initiate."
                auth={false}
            >
                <ParamTable
                    title="JSON body"
                    rows={[
                        { name: "code",   type: "string", required: true, description: "Authorization code from the initiate step" },
                        { name: "state",  type: "string", required: true, description: "State value returned by the initiate step (CSRF check)" },
                        { name: "school", type: "string", required: true, description: "School slug" },
                    ]}
                />
                <CodeBlock language="json" code={`// 200 OK\n{ "access_token": "eyJhbGc...", "expires_in": 2592000, "token_type": "Bearer" }`} />
            </EndpointCard>

            <SectionHeading id="endpoint-token-refresh">POST /api/v2/token-refresh</SectionHeading>
            <p style={muted}>
                Silently refreshes an existing token before it expires. The caller provides the current token;
                the server handles re-initiating the PKCE flow if a refresh token is available.
            </p>
            <EndpointCard
                method="POST"
                path="/api/v2/token-refresh"
                description="Refresh an existing AuthV2 access token."
                auth={true}
            >
                <ParamTable
                    title="JSON body"
                    rows={[
                        { name: "school", type: "string", required: true, description: "School slug" },
                    ]}
                />
                <CodeBlock language="json" code={`// 200 OK\n{ "access_token": "eyJhbGc...", "expires_in": 2592000 }`} />
            </EndpointCard>

            <SectionHeading id="endpoint-login-legacy">POST /api/login</SectionHeading>
            <p style={muted}>
                Legacy combined endpoint: runs the full AuthV2 PKCE flow internally (Steps 1–4) and returns
                both the Bearer token and the translated session cookies in a single call. Designed for apps
                that want a simple one-shot login with no multi-step handling.
            </p>
            <EndpointCard
                method="POST"
                path="/api/login"
                description="Full AuthV2 login in a single request. Returns Bearer token and session cookies."
                auth={false}
            >
                <ParamTable
                    title="JSON body"
                    rows={[
                        { name: "username", type: "string", required: true,  description: "SchoolSoft username" },
                        { name: "password", type: "string", required: true,  description: "SchoolSoft password" },
                        { name: "school",   type: "string", required: true,  description: "School slug" },
                        { name: "orgid",    type: "string", required: false, description: "Organisation ID (falls back to school slug)" },
                    ]}
                />
                <CodeBlock language="json" code={`// 200 OK\n{\n  "token": "eyJhbGc...",\n  "expires_in": 2592000,\n  "cookies": ["JSESSIONID=abc123; Path=/; HttpOnly", "hash=xyz; Path=/"]\n}`} />
            </EndpointCard>

            <SectionHeading id="endpoint-token-legacy">POST /api/token</SectionHeading>
            <p style={muted}>
                Returns the raw token response after a prior <code style={inlineCode}>/api/login</code> call.
                Useful for clients that need the token value separately from the session cookies.
            </p>
            <EndpointCard
                method="POST"
                path="/api/token"
                description="Retrieve the Bearer token from a completed login session."
                auth={true}
            >
                <CodeBlock language="json" code={`// 200 OK\n{ "access_token": "eyJhbGc...", "token_type": "Bearer", "expires_in": 2592000 }`} />
            </EndpointCard>

            <SectionHeading id="endpoint-refresh-legacy">POST /api/refresh</SectionHeading>
            <p style={muted}>
                Legacy token refresh endpoint. Accepts an existing session token and attempts to obtain a new
                one, extending the session without requiring the user to re-enter their credentials.
            </p>
            <EndpointCard
                method="POST"
                path="/api/refresh"
                description="Refresh an existing Bearer token."
                auth={true}
            >
                <CodeBlock language="json" code={`// 200 OK\n{ "access_token": "eyJhbGc...", "expires_in": 2592000 }`} />
            </EndpointCard>

            <SectionHeading id="endpoint-session">GET /api/session</SectionHeading>
            <p style={muted}>
                Returns metadata about the currently authenticated session — user ID, name, school, token
                expiry, and role. Used to verify that a token is still valid without making a full data request.
            </p>
            <EndpointCard
                method="GET"
                path="/api/session"
                description="Returns metadata for the currently authenticated session."
                auth={true}
            >
                <CodeBlock language="json" code={`// 200 OK\n{\n  "userId": 12345,\n  "name": "Anna Lindqvist",\n  "school": "engelska",\n  "role": "Student",\n  "expiresAt": "2026-06-14T10:30:00Z"\n}`} />
            </EndpointCard>

            {/* ══════════════ Implementation ══════════════ */}
            <SectionHeading id="impl-pkce-utils">PKCE utilities</SectionHeading>
            <p style={muted}>
                A minimal self-contained PKCE helper using only Node.js built-ins:
            </p>
            <CodeBlock
                language="typescript"
                code={`import crypto from "crypto";

/** Generate a PKCE verifier/challenge pair (RFC 7636, S256 method). */
export function makePkcePair(): { verifier: string; challenge: string } {
  const verifier  = crypto.randomBytes(32).toString("base64url");
  const challenge = crypto.createHash("sha256").update(verifier).digest("base64url");
  return { verifier, challenge };
}

/** Verify that a received state matches the one we sent. */
export function verifyState(sent: string, received: string): boolean {
  // Use timingSafeEqual to prevent timing attacks
  const a = Buffer.from(sent);
  const b = Buffer.from(received);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}`}
            />

            <SectionHeading id="impl-full-example">Full implementation example</SectionHeading>
            <p style={muted}>
                The following example performs the complete AuthV2 flow — from cold start to a usable Bearer
                token — using only Node.js built-ins:
            </p>
            <CodeBlock
                language="typescript"
                code={`import crypto from "crypto";
import https  from "https";

// ── Helpers ───────────────────────────────────────────────────
function makePkcePair() {
  const verifier  = crypto.randomBytes(32).toString("base64url");
  const challenge = crypto.createHash("sha256").update(verifier).digest("base64url");
  return { verifier, challenge };
}

async function post(url: string, body: unknown): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const req = https.request(url, {
      method:  "POST",
      headers: {
        "Content-Type":   "application/json",
        "Content-Length": Buffer.byteLength(payload),
        "User-Agent":     "Schoolsoft+/1.0",
      },
    }, (res) => {
      let raw = "";
      res.on("data", (c) => (raw += c));
      res.on("end",  () => resolve(JSON.parse(raw)));
    });
    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

// ── AuthV2 Flow ───────────────────────────────────────────────
async function authV2Login(school: string, username: string, password: string) {
  const STATE = crypto.randomBytes(16).toString("hex");
  const { verifier, challenge } = makePkcePair();

  // Step 2: Authorization request
  const authData = await post(
    \`https://sms.schoolsoft.se/\${school}/rest-api/login/student/password\`,
    {
      username,
      password,
      code_challenge:        challenge,
      code_challenge_method: "S256",
      client_id:             "eApp",
      redirect_uri:          "eapp://login",
      response_type:         "code",
      state:                 STATE,
      orgid:                 school,
    }
  ) as { code: string; state: string };

  // Step 3: Verify state (CSRF protection)
  if (authData.state !== STATE) throw new Error("State mismatch — possible CSRF");

  // Step 4: Token exchange
  const tokenData = await post(
    \`https://sms.schoolsoft.se/\${school}/rest-api/login/token\`,
    {
      clientId:      "eApp",
      grantType:     "code",
      code:          authData.code,
      code_verifier: verifier,
    }
  ) as { access_token: string; expires_in: number; token_type: string };

  // The password is no longer referenced after this point.
  return tokenData;
}

// ── Usage ─────────────────────────────────────────────────────
const token = await authV2Login("engelska", "student@example.com", "hunter2");
console.log(\`Token (valid \${token.expires_in / 86400} days):\`, token.access_token);`}
            />

            <SectionHeading id="impl-token-storage">Token storage</SectionHeading>
            <p style={muted}>
                Because the token is valid for 30 days it needs to be stored somewhere. The rules are simple:
            </p>
            <ul style={{ ...muted, paddingLeft: "1.25rem" }}>
                <li style={{ marginBottom: "0.4rem" }}>
                    <strong style={{ color: "var(--foreground)" }}>Never store in LocalStorage</strong> — accessible
                    to any JavaScript on the page (XSS risk).
                </li>
                <li style={{ marginBottom: "0.4rem" }}>
                    <strong style={{ color: "var(--foreground)" }}>Prefer HttpOnly cookies</strong> — the browser
                    stores the token but scripts cannot read it.
                </li>
                <li style={{ marginBottom: "0.4rem" }}>
                    <strong style={{ color: "var(--foreground)" }}>For native mobile apps</strong> — use the
                    platform keychain (iOS Keychain, Android Keystore). Never write raw tokens to shared
                    storage or logs.
                </li>
                <li>
                    <strong style={{ color: "var(--foreground)" }}>Server-side sessions</strong> — store
                    the token server-side and give the client an opaque session ID. This is what SchoolSoft+
                    does.
                </li>
            </ul>

            {/* ══════════════ Security ══════════════ */}
            <SectionHeading id="security-model">Security model</SectionHeading>
            <p style={muted}>
                AuthV2 is designed around the principle that <strong style={{ color: "var(--foreground)" }}>credentials
                are ephemeral</strong>. The password is the identity proof; the token is the capability proof.
                Once the token is issued, the password is no longer needed.
            </p>

            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "0.75rem",
                marginBottom: "1.5rem",
            }}>
                {[
                    { label: "Credential exposure window", value: "Single HTTP request" },
                    { label: "Token lifetime",              value: "30 days (2 592 000 s)" },
                    { label: "PKCE verifier scope",         value: "Per-request, in-memory only" },
                    { label: "CSRF protection",             value: "Random state parameter" },
                    { label: "Code replay protection",      value: "One-time use + PKCE verifier" },
                    { label: "Intercept protection",        value: "PKCE (no secret in binary)" },
                ].map(({ label, value }) => (
                    <div key={label} style={{
                        padding: "0.875rem 1rem",
                        borderRadius: "8px",
                        border: "1px solid var(--border)",
                        background: "var(--surface)",
                    }}>
                        <p style={{ margin: "0 0 0.2rem", fontSize: "0.75rem", color: "var(--muted)", fontWeight: 500 }}>{label}</p>
                        <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--foreground)", fontWeight: 600 }}>{value}</p>
                    </div>
                ))}
            </div>

            <SectionHeading id="security-what-not-stored">What is NOT stored</SectionHeading>
            <Callout type="warning">
                SchoolSoft+ <strong>does not</strong> store usernames, passwords, or raw credentials anywhere —
                not in a database, not in LocalStorage, not in logs. The password is forwarded directly to
                SchoolSoft over HTTPS on the single authorization request and then discarded.
            </Callout>
            <p style={muted}>
                Only the following are persisted (server-side, in an encrypted session):
            </p>
            <ul style={{ ...muted, paddingLeft: "1.25rem" }}>
                <li>The Bearer <strong style={{ color: "var(--foreground)" }}>access token</strong></li>
                <li>The token <strong style={{ color: "var(--foreground)" }}>expiry timestamp</strong></li>
                <li>The <strong style={{ color: "var(--foreground)" }}>school slug</strong> and <strong style={{ color: "var(--foreground)" }}>user ID</strong></li>
            </ul>
            <p style={muted}>
                The <code style={inlineCode}>code_verifier</code> is held in memory only for the duration of
                the token exchange (Steps 1–4) and then discarded.
            </p>

            {/* ══════════════ Reference ══════════════ */}
            <SectionHeading id="ref-pkce-params">PKCE parameters reference</SectionHeading>
            <ParamTable
                rows={[
                    { name: "code_verifier",        type: "string",  required: true,  description: "Random 32-byte value, base64url-encoded (~43 chars). Generated fresh per login. NEVER sent to the server during authorization — only during token exchange." },
                    { name: "code_challenge",        type: "string",  required: true,  description: "SHA-256(code_verifier), base64url-encoded. Sent to the authorization endpoint." },
                    { name: "code_challenge_method", type: "string",  required: true,  description: "Must be \"S256\" (SHA-256). Plain is not accepted by SchoolSoft." },
                    { name: "client_id",             type: "string",  required: true,  description: "Always \"eApp\" — the identifier for SchoolSoft's mobile app client." },
                    { name: "redirect_uri",          type: "string",  required: true,  description: "\"eapp://login\" — the deep-link URI the mobile app registers. Must match exactly." },
                    { name: "response_type",         type: "string",  required: true,  description: "Always \"code\" — standard OAuth 2.0 Authorization Code flow." },
                    { name: "state",                 type: "string",  required: true,  description: "Random value generated per request. Returned unchanged in the response. Verify this matches before token exchange to prevent CSRF." },
                    { name: "orgid",                 type: "string",  required: true,  description: "The school slug (e.g. \"engelska\"). Scopes the authorization to the correct school." },
                    { name: "grantType",             type: "string",  required: true,  description: "\"code\" — used during token exchange to identify this as an Authorization Code grant." },
                    { name: "clientId",              type: "string",  required: true,  description: "\"eApp\" — same as client_id but used in the token exchange request body." },
                ]}
            />

            <SectionHeading id="ref-token-response">Token response fields</SectionHeading>
            <ParamTable
                rows={[
                    { name: "access_token", type: "string", required: true,  description: "The Bearer token. Include as Authorization: Bearer <token> on all API requests." },
                    { name: "token_type",   type: "string", required: true,  description: "Always \"Bearer\"." },
                    { name: "expires_in",   type: "number", required: true,  description: "Token lifetime in seconds. SchoolSoft returns 2592000 (30 days)." },
                    { name: "scope",        type: "string", required: false, description: "OAuth scopes granted. May be absent if SchoolSoft does not return explicit scopes." },
                ]}
            />

            {/* ══════════════ Multi-language Examples ══════════════ */}
            <SectionHeading id="lang-typescript">TypeScript</SectionHeading>
            <p style={muted}>Full AuthV2 login flow using Node.js built-ins — no dependencies required.</p>
            <CodeBlock
                language="typescript"
                code={`import crypto from "crypto";
import https  from "https";

function makePkcePair() {
  const verifier  = crypto.randomBytes(32).toString("base64url");
  const challenge = crypto.createHash("sha256").update(verifier).digest("base64url");
  return { verifier, challenge };
}

async function post(url: string, body: unknown): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const req = https.request(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(payload) },
    }, (res) => {
      let raw = "";
      res.on("data", (c) => (raw += c));
      res.on("end",  () => resolve(JSON.parse(raw)));
    });
    req.on("error", reject); req.write(payload); req.end();
  });
}

const school = "engelska";
const STATE  = crypto.randomBytes(16).toString("hex");
const { verifier, challenge } = makePkcePair();

const auth = await post(
  \`https://sms.schoolsoft.se/\${school}/rest-api/login/student/password\`,
  { username: "anna.lindqvist", password: "s3cr3t",
    code_challenge: challenge, code_challenge_method: "S256",
    client_id: "eApp", redirect_uri: "eapp://login",
    response_type: "code", state: STATE, orgid: school },
);

if (auth["state"] !== STATE) throw new Error("State mismatch — possible CSRF");

const token = await post(
  \`https://sms.schoolsoft.se/\${school}/rest-api/login/token\`,
  { clientId: "eApp", grantType: "code", code: auth["code"], code_verifier: verifier },
);

console.log(token["access_token"]); // Bearer token, valid 30 days`}
            />

            <SectionHeading id="lang-python">Python</SectionHeading>
            <p style={muted}>Uses only the Python standard library — no <code style={inlineCode}>requests</code> or other packages needed.</p>
            <CodeBlock
                language="typescript"
                code={`import hashlib, base64, json, os, urllib.request

def b64url(b: bytes) -> str:
    return base64.urlsafe_b64encode(b).rstrip(b"=").decode()

school    = "engelska"
verifier  = b64url(os.urandom(32))
challenge = b64url(hashlib.sha256(verifier.encode()).digest())
state     = b64url(os.urandom(16))

def post(url, payload):
    data = json.dumps(payload).encode()
    req  = urllib.request.Request(
        url, data=data,
        headers={"Content-Type": "application/json", "User-Agent": "Schoolsoft+/1.0"})
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())

auth = post(
    f"https://sms.schoolsoft.se/{school}/rest-api/login/student/password",
    {"username": "anna.lindqvist", "password": "s3cr3t",
     "code_challenge": challenge, "code_challenge_method": "S256",
     "client_id": "eApp", "redirect_uri": "eapp://login",
     "response_type": "code", "state": state, "orgid": school})

assert auth["state"] == state, "State mismatch"

token = post(
    f"https://sms.schoolsoft.se/{school}/rest-api/login/token",
    {"clientId": "eApp", "grantType": "code",
     "code": auth["code"], "code_verifier": verifier})

print(token["access_token"])  # Bearer token, valid 30 days`}
            />

            <SectionHeading id="lang-curl">curl</SectionHeading>
            <p style={muted}>Two-step shell script using <code style={inlineCode}>openssl</code> for PKCE generation and <code style={inlineCode}>jq</code> for JSON parsing.</p>
            <CodeBlock
                language="bash"
                code={`# Generate PKCE pair
VERIFIER=$(openssl rand -base64 32 | tr '+/' '-_' | tr -d '=\n')
CHALLENGE=$(printf '%s' "$VERIFIER" | openssl dgst -sha256 -binary | base64 | tr '+/' '-_' | tr -d '=\n')
STATE=$(openssl rand -hex 16)
SCHOOL="engelska"

# Step 1 — Authorization request
AUTH=$(curl -s -X POST \
  "https://sms.schoolsoft.se/$SCHOOL/rest-api/login/student/password" \
  -H "Content-Type: application/json" \
  -d "{\
    \\"username\\": \\"anna.lindqvist\\",\
    \\"password\\": \\"s3cr3t\\",\
    \\"code_challenge\\": \\"$CHALLENGE\\",\
    \\"code_challenge_method\\": \\"S256\\",\
    \\"client_id\\": \\"eApp\\",\
    \\"redirect_uri\\": \\"eapp://login\\",\
    \\"response_type\\": \\"code\\",\
    \\"state\\": \\"$STATE\\",\
    \\"orgid\\": \\"$SCHOOL\\"\
  }")

CODE=$(echo "$AUTH" | jq -r '.code')

# Step 2 — Token exchange
curl -s -X POST \
  "https://sms.schoolsoft.se/$SCHOOL/rest-api/login/token" \
  -H "Content-Type: application/json" \
  -d "{\\"clientId\\":\\"eApp\\",\\"grantType\\":\\"code\\",\\"code\\":\\"$CODE\\",\\"code_verifier\\":\\"$VERIFIER\\"}" \
  | jq -r '.access_token'`}
            />

            <SectionHeading id="lang-go">Go</SectionHeading>
            <p style={muted}>Standard library only — no external modules required.</p>
            <CodeBlock
                language="typescript"
                code={`package main

import (
\t"bytes"
\t"crypto/rand"
\t"crypto/sha256"
\t"encoding/base64"
\t"encoding/json"
\t"fmt"
\t"net/http"
)

func b64url(b []byte) string {
\treturn base64.RawURLEncoding.EncodeToString(b)
}

func makePKCE() (verifier, challenge string) {
\traw := make([]byte, 32); rand.Read(raw)
\tverifier = b64url(raw)
\tsum := sha256.Sum256([]byte(verifier))
\tchallenge = b64url(sum[:])
\treturn
}

func post(url string, body any) map[string]any {
\tpayload, _ := json.Marshal(body)
\tresp, _ := http.Post(url, "application/json", bytes.NewReader(payload))
\tdefer resp.Body.Close()
\tvar result map[string]any
\tjson.NewDecoder(resp.Body).Decode(&result)
\treturn result
}

func main() {
\tschool := "engelska"
\tstateBytes := make([]byte, 16); rand.Read(stateBytes)
\tstate := b64url(stateBytes)
\tverifier, challenge := makePKCE()

\tauth := post(fmt.Sprintf("https://sms.schoolsoft.se/%s/rest-api/login/student/password", school),
\t\tmap[string]any{
\t\t\t"username": "anna.lindqvist", "password": "s3cr3t",
\t\t\t"code_challenge": challenge, "code_challenge_method": "S256",
\t\t\t"client_id": "eApp", "redirect_uri": "eapp://login",
\t\t\t"response_type": "code", "state": state, "orgid": school,
\t\t})

\ttoken := post(fmt.Sprintf("https://sms.schoolsoft.se/%s/rest-api/login/token", school),
\t\tmap[string]any{
\t\t\t"clientId": "eApp", "grantType": "code",
\t\t\t"code": auth["code"], "code_verifier": verifier,
\t\t})

\tfmt.Println(token["access_token"]) // Bearer token
}`}
            />

            <SectionHeading id="lang-kotlin">Kotlin</SectionHeading>
            <p style={muted}>JVM/Android example using <code style={inlineCode}>OkHttp</code> and <code style={inlineCode}>org.json</code>.</p>
            <CodeBlock
                language="typescript"
                code={`import okhttp3.*
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.security.MessageDigest
import java.security.SecureRandom
import java.util.Base64

val JSON_TYPE = "application/json".toMediaType()
val client    = OkHttpClient()

fun b64url(b: ByteArray): String =
    Base64.getUrlEncoder().withoutPadding().encodeToString(b)

fun makePkce(): Pair<String, String> {
    val verifier  = b64url(SecureRandom().generateSeed(32))
    val challenge = b64url(MessageDigest.getInstance("SHA-256").digest(verifier.toByteArray()))
    return verifier to challenge
}

fun post(url: String, body: JSONObject): JSONObject {
    val req = Request.Builder().url(url)
        .post(body.toString().toRequestBody(JSON_TYPE)).build()
    return JSONObject(client.newCall(req).execute().body!!.string())
}

val school = "engelska"
val state  = b64url(SecureRandom().generateSeed(16))
val (verifier, challenge) = makePkce()

val auth = post(
    "https://sms.schoolsoft.se/$school/rest-api/login/student/password",
    JSONObject(mapOf("username" to "anna.lindqvist", "password" to "s3cr3t",
        "code_challenge" to challenge, "code_challenge_method" to "S256",
        "client_id" to "eApp", "redirect_uri" to "eapp://login",
        "response_type" to "code", "state" to state, "orgid" to school)))

val token = post(
    "https://sms.schoolsoft.se/$school/rest-api/login/token",
    JSONObject(mapOf("clientId" to "eApp", "grantType" to "code",
        "code" to auth.getString("code"), "code_verifier" to verifier)))

println(token.getString("access_token")) // Bearer token`}
            />

            <SectionHeading id="lang-swift">Swift</SectionHeading>
            <p style={muted}>iOS/macOS example using <code style={inlineCode}>URLSession</code> and <code style={inlineCode}>CryptoKit</code> (Swift 5.9+).</p>
            <CodeBlock
                language="typescript"
                code={`import Foundation
import CryptoKit

func b64url(_ data: Data) -> String {
    data.base64EncodedString()
        .replacingOccurrences(of: "+", with: "-")
        .replacingOccurrences(of: "/", with: "_")
        .replacingOccurrences(of: "=", with: "")
}

func makePKCE() -> (verifier: String, challenge: String) {
    var bytes = [UInt8](repeating: 0, count: 32)
    SecRandomCopyBytes(kSecRandomDefault, bytes.count, &bytes)
    let verifier  = b64url(Data(bytes))
    let challenge = b64url(Data(SHA256.hash(data: Data(verifier.utf8))))
    return (verifier, challenge)
}

func post(_ urlStr: String, body: [String: Any]) async throws -> [String: Any] {
    var req = URLRequest(url: URL(string: urlStr)!)
    req.httpMethod = "POST"
    req.setValue("application/json", forHTTPHeaderField: "Content-Type")
    req.httpBody = try JSONSerialization.data(withJSONObject: body)
    let (data, _) = try await URLSession.shared.data(for: req)
    return try JSONSerialization.jsonObject(with: data) as! [String: Any]
}

let school = "engelska"
let state  = UUID().uuidString.filter { $0.isHexDigit }.lowercased()
let (verifier, challenge) = makePKCE()

let auth = try await post(
    "https://sms.schoolsoft.se/\(school)/rest-api/login/student/password",
    body: ["username": "anna.lindqvist", "password": "s3cr3t",
           "code_challenge": challenge, "code_challenge_method": "S256",
           "client_id": "eApp", "redirect_uri": "eapp://login",
           "response_type": "code", "state": state, "orgid": school])

let token = try await post(
    "https://sms.schoolsoft.se/\(school)/rest-api/login/token",
    body: ["clientId": "eApp", "grantType": "code",
           "code": auth["code"]!, "code_verifier": verifier])

print(token["access_token"] as! String) // Bearer token`}
            />

            <SectionHeading id="lang-php">PHP</SectionHeading>
            <p style={muted}>PHP 8.1+ using only built-in functions — no Composer packages needed.</p>
            <CodeBlock
                language="typescript"
                code={`<?php

function b64url(string $bytes): string {
    return rtrim(strtr(base64_encode($bytes), '+/', '-_'), '=');
}

function makePkce(): array {
    $verifier  = b64url(random_bytes(32));
    $challenge = b64url(hash('sha256', $verifier, true));
    return [$verifier, $challenge];
}

function jsonPost(string $url, array $body): array {
    $ctx = stream_context_create(['http' => [
        'method'  => 'POST',
        'header'  => "Content-Type: application/json\r\nUser-Agent: Schoolsoft+/1.0\r\n",
        'content' => json_encode($body),
    ]]);
    return json_decode(file_get_contents($url, false, $ctx), true);
}

$school = 'engelska';
$state  = bin2hex(random_bytes(16));
[$verifier, $challenge] = makePkce();

$auth = jsonPost("https://sms.schoolsoft.se/$school/rest-api/login/student/password", [
    'username' => 'anna.lindqvist', 'password' => 's3cr3t',
    'code_challenge' => $challenge, 'code_challenge_method' => 'S256',
    'client_id' => 'eApp', 'redirect_uri' => 'eapp://login',
    'response_type' => 'code', 'state' => $state, 'orgid' => $school,
]);

$token = jsonPost("https://sms.schoolsoft.se/$school/rest-api/login/token", [
    'clientId' => 'eApp', 'grantType' => 'code',
    'code' => $auth['code'], 'code_verifier' => $verifier,
]);

echo $token['access_token'] . PHP_EOL; // Bearer token`}
            />

            <SectionHeading id="lang-ruby">Ruby</SectionHeading>
            <p style={muted}>Pure Ruby using the standard library — no gems required.</p>
            <CodeBlock
                language="typescript"
                code={`require 'net/http'
require 'json'
require 'digest'
require 'base64'
require 'securerandom'

def b64url(bytes)
  Base64.urlsafe_encode64(bytes, padding: false)
end

def make_pkce
  verifier  = b64url(SecureRandom.random_bytes(32))
  challenge = b64url(Digest::SHA256.digest(verifier))
  [verifier, challenge]
end

def json_post(url, body)
  uri  = URI(url)
  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = true
  req = Net::HTTP::Post.new(uri, 'Content-Type' => 'application/json')
  req.body = body.to_json
  JSON.parse(http.request(req).body)
end

school              = 'engelska'
state               = SecureRandom.hex(16)
verifier, challenge = make_pkce

auth = json_post("https://sms.schoolsoft.se/#{school}/rest-api/login/student/password", {
  username: 'anna.lindqvist', password: 's3cr3t',
  code_challenge: challenge, code_challenge_method: 'S256',
  client_id: 'eApp', redirect_uri: 'eapp://login',
  response_type: 'code', state: state, orgid: school,
})

token = json_post("https://sms.schoolsoft.se/#{school}/rest-api/login/token", {
  clientId: 'eApp', grantType: 'code',
  code: auth['code'], code_verifier: verifier,
})

puts token['access_token'] # Bearer token`}
            />

            <SectionHeading id="lang-csharp">C#</SectionHeading>
            <p style={muted}>.NET 6+ using <code style={inlineCode}>HttpClient</code> and <code style={inlineCode}>System.Text.Json</code> — no NuGet packages needed.</p>
            <CodeBlock
                language="typescript"
                code={`using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

static string B64Url(byte[] bytes) =>
    Convert.ToBase64String(bytes).Replace('+', '-').Replace('/', '_').TrimEnd('=');

static (string verifier, string challenge) MakePkce()
{
    var verifier  = B64Url(RandomNumberGenerator.GetBytes(32));
    var challenge = B64Url(SHA256.HashData(Encoding.UTF8.GetBytes(verifier)));
    return (verifier, challenge);
}

static async Task<JsonElement> Post(HttpClient http, string url, object body)
{
    var json     = JsonSerializer.Serialize(body);
    var response = await http.PostAsync(url, new StringContent(json, Encoding.UTF8, "application/json"));
    using var doc = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
    return doc.RootElement.Clone();
}

var school = "engelska";
var state  = Convert.ToHexString(RandomNumberGenerator.GetBytes(16)).ToLower();
var (verifier, challenge) = MakePkce();

using var http = new HttpClient();
http.DefaultRequestHeaders.Add("User-Agent", "Schoolsoft+/1.0");

var authEl = await Post(http,
    $"https://sms.schoolsoft.se/{school}/rest-api/login/student/password",
    new { username = "anna.lindqvist", password = "s3cr3t",
          code_challenge = challenge, code_challenge_method = "S256",
          client_id = "eApp", redirect_uri = "eapp://login",
          response_type = "code", state, orgid = school });

var code = authEl.GetProperty("code").GetString()!;

var tokenEl = await Post(http,
    $"https://sms.schoolsoft.se/{school}/rest-api/login/token",
    new { clientId = "eApp", grantType = "code", code, code_verifier = verifier });

Console.WriteLine(tokenEl.GetProperty("access_token").GetString()); // Bearer token`}
            />
        </DocLayout>
    );
}
