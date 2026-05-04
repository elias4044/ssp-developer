import type { Metadata } from "next";
import DocLayout, { type SidebarSection } from "@/components/DocLayout";
import {
    SectionHeading,
    SubHeading,
    CodeBlock,
    ParamTable,
    Callout,
} from "@/components/DocComponents";

export const metadata: Metadata = {
    title: "SchoolSoft+ Node — ssp-node",
    description:
        "Full documentation for ssp-node, the official SchoolSoft+ Node.js library. Covers installation, authentication flows, every data endpoint, functional API, raw requests, PKCE utilities, token storage, and all exported types.",
};

const sidebar: SidebarSection[] = [
    {
        title: "Getting Started",
        items: [
            { id: "introduction", label: "Introduction" },
            { id: "installation", label: "Installation" },
            { id: "quick-start", label: "Quick start" },
        ],
    },
    {
        title: "Authentication",
        items: [
            { id: "simple-login", label: "Simple login" },
            { id: "mobile-login-auto", label: "Mobile login (auto)" },
            { id: "mobile-login-browser", label: "Mobile login (browser)" },
            { id: "token-management", label: "Token management" },
            { id: "session-management", label: "Session management" },
        ],
    },
    {
        title: "Data Endpoints",
        items: [
            { id: "get-schools", label: "getSchools" },
            { id: "get-session", label: "getSession" },
            { id: "get-lunch", label: "getLunch" },
            { id: "get-schedule", label: "getSchedule" },
            { id: "get-assignments-for-week", label: "getAssignmentsForWeek" },
            { id: "get-assignment", label: "getAssignment" },
            { id: "get-subjects", label: "getSubjects" },
            { id: "get-subject", label: "getSubject" },
            { id: "get-news", label: "getNews" },
            { id: "get-startpage", label: "getStartpage" },
            { id: "get-class-students", label: "getClassStudents" },
        ],
    },
    {
        title: "Advanced",
        items: [
            { id: "functional-api", label: "Functional API" },
            { id: "raw-requests", label: "Raw requests" },
            { id: "pkce-utilities", label: "PKCE utilities" },
            { id: "token-storage", label: "Token storage" },
            { id: "error-handling", label: "Error handling" },
        ],
    },
    {
        title: "Reference",
        items: [
            { id: "types", label: "Types" },
            { id: "client-options", label: "Client options" },
            { id: "exports", label: "All exports" },
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

export default function SspNodePage() {
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
                    NPM LIBRARY
                </div>
                <h1 style={{
                    fontSize: "clamp(1.75rem, 4vw, 2.25rem)", fontWeight: 800,
                    letterSpacing: "-0.03em", color: "var(--foreground)", marginBottom: "0.75rem",
                }}>
                    SchoolSoft+ Node
                </h1>
                <p style={mutedLg}>
                    <code style={inlineCode}>@elias4044/ssp-node</code> is the official Node.js library for
                    the SchoolSoft+ platform. It wraps SchoolSoft&apos;s unofficial internal REST API and gives you
                    a clean, typed interface to authenticate, fetch schedules, assignments, lunch menus, news, and more —
                    all without any runtime dependencies beyond Node&apos;s built-in modules.
                </p>
            </div>

            <Callout type="info">
                This library targets SchoolSoft&apos;s <strong>unofficial, reverse-engineered API</strong>.
                Endpoints may change without notice.
            </Callout>

            {/*  INTRODUCTION  */}
            <SectionHeading id="introduction">Introduction</SectionHeading>
            <p style={muted}>
                SchoolSoft+ Node provides two ways to interact with SchoolSoft:
            </p>
            <ul style={{ ...muted, paddingLeft: "1.25rem" }}>
                <li style={{ marginBottom: "0.5rem" }}>
                    <strong style={{ color: "var(--foreground)" }}>SchoolsoftClient class</strong> — A stateful
                    client that holds your session, automatically refreshes tokens, and exposes every endpoint
                    as a method. This is the recommended approach for most use-cases.
                </li>
                <li>
                    <strong style={{ color: "var(--foreground)" }}>Functional API</strong> — Every internal
                    function used by the class is also exported individually. Useful for serverless
                    environments, functional codebases, or when you want fine-grained control.
                </li>
            </ul>
            <p style={muted}>
                The library uses <strong style={{ color: "var(--foreground)" }}>Node&apos;s built-in <code style={inlineCode}>https</code> module</strong> for
                all HTTP requests — no <code style={inlineCode}>axios</code>, no <code style={inlineCode}>node-fetch</code>,
                no runtime dependencies whatsoever.
                It is fully typed with TypeScript and ships its own type declarations.
            </p>

            {/*  INSTALLATION  */}
            <SectionHeading id="installation">Installation</SectionHeading>
            <CodeBlock language="bash" code={`npm install @elias4044/ssp-node`} />
            <p style={muted}>
                Requires <strong style={{ color: "var(--foreground)" }}>Node.js 18+</strong> (uses
                the <code style={inlineCode}>crypto</code> and <code style={inlineCode}>https</code> built-ins).
                Works in CommonJS and ESM projects. TypeScript 5+ is recommended.
            </p>

            {/*  QUICK START  */}
            <SectionHeading id="quick-start">Quick start</SectionHeading>
            <p style={muted}>
                The fastest path from zero to fetching data is a simple username/password login:
            </p>
            <CodeBlock language="typescript" code={`import { SchoolsoftClient } from '@elias4044/ssp-node';

const client = new SchoolsoftClient({ school: 'engelska' });

await client.login({ username: 'john.doe', password: 'mypassword' });

const lunch    = await client.getLunch(22);         // week 22
const schedule = await client.getSchedule();        // current week (auto-detected)
const news     = await client.getNews();`} />
            <p style={muted}>
                For longer-lived sessions (e.g. a mobile app or a daemon), use the mobile OAuth2 flow
                to get a refresh token:
            </p>
            <CodeBlock language="typescript" code={`const client = new SchoolsoftClient({ school: 'engelska' });

await client.mobileLogin({ username: 'john.doe', password: 'mypassword' });
await client.mobileExchangeSession();   // converts access token → session cookies

const subjects = await client.getSubjects();`} />

            {/*  AUTHENTICATION  */}
            <SectionHeading id="simple-login">Authentication — Simple login</SectionHeading>
            <p style={muted}>
                Simple login submits your credentials to SchoolSoft&apos;s JSP login form. On success,
                SchoolSoft returns an HTTP 302 redirect and sets three cookies:
                <code style={inlineCode}>JSESSIONID</code>, <code style={inlineCode}>hash</code>, and
                <code style={inlineCode}>usertype</code>. The library captures these automatically.
            </p>
            <CodeBlock language="typescript" code={`const result = await client.login({
  username: 'john.doe',
  password:  'secret',
  usertype:  '1',      // '1' = student (default), '2' = guardian, '3' = staff
});

console.log(result.jsessionid);   // raw JSESSIONID cookie value
console.log(result.hash);         // raw hash cookie value
console.log(result.cookieHeader); // 'JSESSIONID=...; hash=...; usertype=1'`} />
            <ParamTable
                title="login() — options"
                rows={[
                    { name: "username", type: "string", required: true,  description: "Your SchoolSoft username (typically firstname.lastname)." },
                    { name: "password", type: "string", required: true,  description: "Your SchoolSoft password." },
                    { name: "usertype", type: "string", required: false, description: "'1' = student (default), '2' = guardian, '3' = staff." },
                ]}
            />
            <p style={muted}>Returns <code style={inlineCode}>SimpleLoginResult</code>.</p>
            <Callout type="warning">
                Simple login sessions are tied to a browser-style JSESSIONID. They may expire after a period of
                inactivity (typically a few hours). Use <code style={inlineCode}>verifySession()</code> to check
                liveness, or prefer the mobile flow for longer-lived sessions.
            </Callout>

            <SubHeading id="simple-login-restore">Restoring a saved simple-login session</SubHeading>
            <p style={muted}>
                You can persist the cookie values after login and restore them on the next startup
                without re-authenticating:
            </p>
            <CodeBlock language="typescript" code={`// Save after login
const { jsessionid, hash, usertype } = await client.login({ ... });
// e.g. store in a file, database, or environment variable

// Restore on next startup
client.setSessionCookies(jsessionid, hash, usertype);

// Optionally verify before using
const alive = await client.verifySession();
if (!alive) await client.login({ ... }); // re-authenticate if expired`} />

            {/* ── Mobile auto ── */}
            <SectionHeading id="mobile-login-auto">Authentication — Mobile login (automated)</SectionHeading>
            <p style={muted}>
                The mobile flow mirrors how the official SchoolSoft eApp authenticates — using
                OAuth2 + PKCE. It gives you a short-lived <strong style={{ color: "var(--foreground)" }}>access token</strong> (≈ 15 min)
                and a long-lived <strong style={{ color: "var(--foreground)" }}>refresh token</strong>.
                You then exchange the access token for session cookies to use the REST API.
            </p>
            <CodeBlock language="typescript" code={`const client = new SchoolsoftClient({ school: 'engelska' });

// Step 1 — obtain access + refresh tokens
const { accessToken, refreshToken, expiresAt } = await client.mobileLogin({
  username: 'john.doe',
  password:  'secret',
  orgid:     '18',    // school organisation ID, defaults to '18'
});

// Step 2 — (optional) fetch user info to get the userId for a more reliable exchange
const info = await client.fetchMobileSessionInfo();
// info: { username, firstName, lastName, email, schoolName, userType, userId }

// Step 3 — exchange the access token for session cookies
await client.mobileExchangeSession(info?.userId, {
  orgid:    '18',
  language: 'sw',       // 'sw' (Swedish) or 'en'
  theme:    'dark',
  useros:   'android',  // 'android' or 'ios'
});

// Now you can call any data endpoint
const schedule = await client.getSchedule();`} />
            <ParamTable
                title="mobileLogin() — options"
                rows={[
                    { name: "username", type: "string", required: true,  description: "SchoolSoft username." },
                    { name: "password", type: "string", required: true,  description: "SchoolSoft password." },
                    { name: "orgid",    type: "string", required: false, description: "School organisation ID. Defaults to '18'." },
                ]}
            />
            <ParamTable
                title="mobileExchangeSession() — options"
                rows={[
                    { name: "userId",      type: "string | number", required: false, description: "The user's numeric ID. Pass fetchMobileSessionInfo().userId for a more reliable exchange." },
                    { name: "orgid",       type: "string", required: false, description: "School org ID. Defaults to '18'." },
                    { name: "language",    type: "string", required: false, description: "'sw' (Swedish, default) or 'en'." },
                    { name: "theme",       type: "string", required: false, description: "'dark' (default) or 'light'." },
                    { name: "useros",      type: "string", required: false, description: "'android' (default) or 'ios'." },
                    { name: "redirectUrl", type: "string", required: false, description: "Override the post-login redirect URL. Defaults to the subject rooms page." },
                ]}
            />

            {/* ── Mobile browser ── */}
            <SectionHeading id="mobile-login-browser">Authentication — Mobile login (browser / WebView)</SectionHeading>
            <p style={muted}>
                For apps that show a login page in a browser or WebView, use the two-step PKCE
                browser flow. You generate a URL the user opens, then complete the flow after
                they authenticate and SchoolSoft redirects back to your app.
            </p>
            <CodeBlock language="typescript" code={`import { SchoolsoftClient } from '@elias4044/ssp-node';

// Step 1 — generate the auth URL and PKCE material
const flow = SchoolsoftClient.startMobileFlow({
  school:      'engelska',
  redirectUri: 'com.myapp://auth',  // your deep-link URI
  orgid:       '18',
});

console.log(flow.authUrl);   // open this in a browser or WebView
// flow.verifier — store securely on device
// flow.state    — store to verify on callback (CSRF protection)

// After the user logs in, SchoolSoft redirects to:
//   com.myapp://auth?code=XXXX&state=YYYY
// Verify flow.state === YYYY, then:

// Step 2 — complete the flow with the code from the deep-link
const client = new SchoolsoftClient({ school: 'engelska' });
await client.completeMobileFlow(code, flow.verifier);

// Step 3 — exchange for session cookies
const info = await client.fetchMobileSessionInfo();
await client.mobileExchangeSession(info?.userId);

const news = await client.getNews();`} />
            <ParamTable
                title="startMobileFlow() — static method options"
                rows={[
                    { name: "school",      type: "string", required: true,  description: "School slug, e.g. 'engelska'." },
                    { name: "redirectUri", type: "string", required: false, description: "Deep-link redirect URI. Defaults to 'com.schoolsoftplus.app://'." },
                    { name: "orgid",       type: "string", required: false, description: "School org ID. Defaults to '18'." },
                ]}
            />
            <p style={muted}>
                Returns <code style={inlineCode}>MobileAuthFlowInit</code> with fields:
                <code style={inlineCode}>authUrl</code>, <code style={inlineCode}>verifier</code>,
                <code style={inlineCode}>state</code>, <code style={inlineCode}>school</code>,
                <code style={inlineCode}>orgid</code>.
            </p>

            {/* ── Token management ── */}
            <SectionHeading id="token-management">Token management</SectionHeading>
            <SubHeading id="token-refresh">Refreshing the access token</SubHeading>
            <p style={muted}>
                Access tokens are short-lived (≈ 15 minutes). Call <code style={inlineCode}>mobileRefresh()</code> to
                exchange the stored refresh token for a new access token. This is done automatically
                by <code style={inlineCode}>mobileExchangeSession()</code> if the token appears expired, but you
                can also call it manually.
            </p>
            <CodeBlock language="typescript" code={`// Manual refresh
await client.mobileRefresh();

// Check token state
console.log(client.accessToken);         // current access token string or null
console.log(client.refreshToken);        // current refresh token or null
console.log(client.isAccessTokenExpired); // boolean`} />
            <Callout type="info">
                <code style={inlineCode}>mobileExchangeSession()</code> automatically calls
                <code style={inlineCode}> mobileRefresh()</code> if <code style={inlineCode}>isAccessTokenExpired</code> is
                true and a refresh token is available. You typically don&apos;t need to call it manually.
            </Callout>

            <SubHeading id="token-restore">Restoring tokens from storage</SubHeading>
            <CodeBlock language="typescript" code={`// After mobileLogin(), persist these values
const toSave = {
  accessToken:  client.accessToken,
  refreshToken: client.refreshToken,
};

// On next startup — restore and proceed without re-logging-in
const client2 = new SchoolsoftClient({ school: 'engelska' });
client2.setAccessToken(toSave.accessToken!, toSave.refreshToken ?? undefined);

// Exchange for session cookies (auto-refreshes if access token expired)
await client2.mobileExchangeSession();`} />

            {/* ── Session management ── */}
            <SectionHeading id="session-management">Session management</SectionHeading>
            <SubHeading id="verify-session">Verifying a session</SubHeading>
            <p style={muted}>
                <code style={inlineCode}>verifySession()</code> sends a lightweight request to
                SchoolSoft&apos;s <code style={inlineCode}>/rest-api/session</code> endpoint to check
                whether the current session cookies are still valid.
            </p>
            <CodeBlock language="typescript" code={`const alive = await client.verifySession();
// true  — session is valid and ready to use
// false — session has expired (need to re-authenticate)`} />

            <SubHeading id="is-authenticated">isAuthenticated</SubHeading>
            <p style={muted}>
                The <code style={inlineCode}>isAuthenticated</code> getter returns <code style={inlineCode}>true</code> if
                session cookies are set in memory — it does <em>not</em> verify with SchoolSoft.
                Use it as a quick guard before making requests, and <code style={inlineCode}>verifySession()</code> when
                you need a guaranteed live check.
            </p>
            <CodeBlock language="typescript" code={`if (!client.isAuthenticated) {
  await client.login({ username, password });
}`} />

            <SubHeading id="logout">Logout</SubHeading>
            <p style={muted}>
                <code style={inlineCode}>logout()</code> clears all in-memory state: session cookies,
                access token, and refresh token. It does <em>not</em> invalidate anything server-side.
            </p>
            <CodeBlock language="typescript" code={`client.logout();
console.log(client.isAuthenticated); // false`} />

            {/*  DATA ENDPOINTS  */}
            <SectionHeading id="get-schools">getSchools()</SectionHeading>
            <p style={muted}>
                Returns every school registered on SchoolSoft, sorted alphabetically by name.
                Results are cached in-process for <strong style={{ color: "var(--foreground)" }}>one hour</strong> to
                avoid hammering SchoolSoft on repeated calls. <strong style={{ color: "var(--foreground)" }}>No authentication required.</strong>
            </p>
            <CodeBlock language="typescript" code={`const schools = await client.getSchools();
// Returns: School[]

// schools[0] might be:
// { id: 'engelska', name: 'Engelska Skolan Norr om Ström' }

// Find a school slug by name
const match = schools.find(s => s.name.toLowerCase().includes('carlwahren'));
console.log(match?.id); // 'carlwahren'`} />
            <p style={muted}>Return type: <code style={inlineCode}>School[]</code></p>
            <CodeBlock language="typescript" code={`interface School {
  name: string;  // full display name
  id:   string;  // URL slug used in all API calls
}`} />

            {/* ── getSession ── */}
            <SectionHeading id="get-session">getSession()</SectionHeading>
            <p style={muted}>
                Returns the full session info for the currently authenticated user from
                SchoolSoft&apos;s <code style={inlineCode}>/rest-api/session</code> endpoint.
                Includes user identity, organisation, and user type.
            </p>
            <CodeBlock language="typescript" code={`const session = await client.getSession();

console.log(session.user.firstName);       // 'John'
console.log(session.user.lastName);        // 'Doe'
console.log(session.user.email);           // 'john.doe@school.se'
console.log(session.user.id);              // 12345
console.log(session.organization.name);   // 'Engelska Skolan'
console.log(session.userType);             // 'student'`} />
            <p style={muted}>Return type: <code style={inlineCode}>SessionInfo</code></p>
            <CodeBlock language="typescript" code={`interface SessionInfo {
  user: {
    userName:  string;
    firstName: string;
    lastName:  string;
    email:     string;
    id:        number;
  };
  organization: {
    name: string;
    [key: string]: unknown;
  };
  userType: string;
  school:   string;
  [key: string]: unknown;
}`} />

            {/* ── getLunch ── */}
            <SectionHeading id="get-lunch">getLunch(week)</SectionHeading>
            <p style={muted}>
                Returns the lunch menu for a given ISO week number. Each day contains a list of
                lunch options for that weekday.
            </p>
            <CodeBlock language="typescript" code={`const menu = await client.getLunch(22);  // week 22
// Returns: LunchMenu  (LunchDay[])

for (const day of menu) {
  console.log(day.weekDayName);                   // 'Monday', 'Tuesday', etc.
  console.log(day.lunchList?.map(l => l.name));   // ['Pasta Bolognese', 'Vegetarian option']
}`} />
            <ParamTable
                title="getLunch() — parameters"
                rows={[
                    { name: "week", type: "number", required: true, description: "ISO week number (1–53)." },
                ]}
            />
            <p style={muted}>Return type: <code style={inlineCode}>LunchMenu</code> (alias for <code style={inlineCode}>LunchDay[]</code>)</p>
            <CodeBlock language="typescript" code={`interface LunchDay {
  weekDay:     number;       // 1 = Monday … 5 = Friday
  weekDayName?: string;      // localised day name
  lunchList?:  LunchItem[];
  [key: string]: unknown;
}

interface LunchItem {
  name: string;
  [key: string]: unknown;
}`} />

            {/* ── getSchedule ── */}
            <SectionHeading id="get-schedule">getSchedule(week?)</SectionHeading>
            <p style={muted}>
                Returns the lesson schedule for the given week. Omitting <code style={inlineCode}>week</code> defaults
                to the <strong style={{ color: "var(--foreground)" }}>current ISO week</strong> (calculated via the
                exported <code style={inlineCode}>isoWeek(date)</code> utility). Lessons are
                de-duplicated and sorted chronologically.
            </p>
            <CodeBlock language="typescript" code={`// Current week
const { lessons, week } = await client.getSchedule();
console.log(\`Week \${week}: \${lessons.length} lessons\`);

// Specific week
const { lessons: w22 } = await client.getSchedule(22);

// Each lesson
for (const lesson of lessons) {
  console.log(lesson.eventId);   // unique identifier
  console.log(lesson.startDate); // ISO 8601 date-time string
  console.log(lesson.endDate);   // ISO 8601 date-time string
  // Additional fields from SchoolSoft (subject name, room, teacher, etc.)
  // are passed through as-is under the [key: string]: unknown index signature
}`} />
            <ParamTable
                title="getSchedule() — parameters"
                rows={[
                    { name: "week", type: "number", required: false, description: "ISO week number (1–53). Defaults to current week." },
                ]}
            />
            <p style={muted}>Return type: <code style={inlineCode}>{"{ lessons: ScheduleLesson[]; week: number }"}</code></p>
            <CodeBlock language="typescript" code={`interface ScheduleLesson {
  eventId:   number | string;
  startDate: string;   // ISO 8601
  endDate:   string;   // ISO 8601
  [key: string]: unknown;
}`} />
            <Callout type="info">
                The library uses the ISO 8601 week algorithm for the <code style={inlineCode}>isoWeek()</code> helper, which
                matches how SchoolSoft numbers weeks (week 1 = first week with a Thursday in the new year).
                You can import it directly: <code style={inlineCode}>{"import { isoWeek } from '@elias4044/ssp-node';"}</code>
            </Callout>

            {/* ── getAssignmentsForWeek ── */}
            <SectionHeading id="get-assignments-for-week">getAssignmentsForWeek(week, year)</SectionHeading>
            <p style={muted}>
                Returns a flat list of all assignments due in a given week. Each object contains
                the assignment&apos;s <code style={inlineCode}>id</code> and <code style={inlineCode}>title</code>, plus any
                additional fields SchoolSoft includes. Pass the ID to <code style={inlineCode}>getAssignment()</code> to
                fetch full details.
            </p>
            <CodeBlock language="typescript" code={`const assignments = await client.getAssignmentsForWeek(22, 2025);
// Returns: Assignment[]

for (const a of assignments) {
  console.log(a.id, a.title);
  // Fetch full details for one
  const detail = await client.getAssignment(a.id);
}`} />
            <ParamTable
                title="getAssignmentsForWeek() — parameters"
                rows={[
                    { name: "week", type: "number", required: true, description: "ISO week number." },
                    { name: "year", type: "number", required: true, description: "Full four-digit year, e.g. 2025." },
                ]}
            />
            <p style={muted}>Return type: <code style={inlineCode}>Assignment[]</code></p>

            {/* ── getAssignment ── */}
            <SectionHeading id="get-assignment">getAssignment(id, type?)</SectionHeading>
            <p style={muted}>
                Fetches complete details for a single assignment or planning entry. Makes up to five
                parallel sub-requests to gather all related data (sections, connected plannings,
                assessment, grading). Returns <code style={inlineCode}>null</code> for sub-resources
                that don&apos;t exist (403/404 are handled gracefully).
            </p>
            <CodeBlock language="typescript" code={`// Default: fetch an assignment
const detail = await client.getAssignment(12345);

// Fetch a planning entry instead
const planning = await client.getAssignment(67890, 'planning');

// Full shape
console.log(detail.assignment);          // view object from SchoolSoft
console.log(detail.sections);            // sections array or null
console.log(detail.connectedPlannings);  // linked planning entries or null
console.log(detail.assessment?.review);              // teacher review text
console.log(detail.assessment?.teacherComment);      // teacher comment
console.log(detail.assessment?.studentComment);      // student comment
console.log(detail.assessment?.assessedCriteriaTabs); // graded criteria
console.log(detail.assessment?.partialMoments);       // partial assessment moments
console.log(detail.grading);             // grading object or null`} />
            <ParamTable
                title="getAssignment() — parameters"
                rows={[
                    { name: "id",   type: "string | number", required: true,  description: "The assignment or planning ID." },
                    { name: "type", type: "'assignment' | 'planning'", required: false, description: "Entry type. Defaults to 'assignment'." },
                ]}
            />
            <p style={muted}>Return type: <code style={inlineCode}>AssignmentDetail</code></p>
            <CodeBlock language="typescript" code={`interface AssignmentDetail {
  assignment:         Record<string, unknown> | null;
  sections:           unknown[] | null;
  connectedPlannings: unknown[] | null;
  assessment: {
    review:              string;
    teacherComment:      string;
    studentComment:      string;
    partialMoments:      unknown[];
    assessedCriteriaTabs: unknown[];
  } | null;
  grading: unknown | null;
}`} />

            {/* ── getSubjects ── */}
            <SectionHeading id="get-subjects">getSubjects()</SectionHeading>
            <p style={muted}>
                Returns all subject rooms for the user, enriched with their entities (assignments
                and plannings), teachers, and the count of unread entities.
            </p>
            <CodeBlock language="typescript" code={`const subjects = await client.getSubjects();
// Returns: Subject[]

for (const sub of subjects) {
  console.log(sub.id);             // subject room ID
  console.log(sub.activityId);     // associated activity ID
  console.log(sub.unreadEntities); // number of unread items
  console.log(sub.teachers);       // array of teacher objects
  console.log(sub.entities);       // SubjectEntity[] — assignments & plannings
}

// Find entities that are assignments
const assignments = subjects
  .flatMap(s => s.entities)
  .filter(e => e.entityType === 'ASSIGNMENT');`} />
            <p style={muted}>Return type: <code style={inlineCode}>Subject[]</code></p>
            <CodeBlock language="typescript" code={`interface Subject {
  activityId:     string;
  id:             string;
  entities:       SubjectEntity[];
  unreadEntities: number;
  teachers:       unknown[];
  [key: string]: unknown;
}

interface SubjectEntity {
  planningId?: string;
  entityType:  'PLANNING' | 'ASSIGNMENT';
  [key: string]: unknown;
}`} />

            {/* ── getSubject ── */}
            <SectionHeading id="get-subject">getSubject(id)</SectionHeading>
            <p style={muted}>
                Returns detailed information about a single subject room, including its examination
                overview, submission status, and all linked assignments.
            </p>
            <CodeBlock language="typescript" code={`const detail = await client.getSubject('123');

console.log(detail.subject);                   // subject metadata
console.log(detail.overview.examinations);     // upcoming examinations
console.log(detail.overview.submissions);      // pending submissions
console.log(detail.assignments);               // all assignments for the subject`} />
            <ParamTable
                title="getSubject() — parameters"
                rows={[
                    { name: "id", type: "string | number", required: true, description: "Subject room ID (from getSubjects())." },
                ]}
            />
            <p style={muted}>Return type: <code style={inlineCode}>SubjectDetail</code></p>

            {/* ── getNews ── */}
            <SectionHeading id="get-news">getNews()</SectionHeading>
            <p style={muted}>
                Scrapes news items from the student startpage HTML. Returns an array of news items
                with an ID, title, and a short preview text.
            </p>
            <CodeBlock language="typescript" code={`const news = await client.getNews();
// Returns: NewsItem[]

for (const item of news) {
  console.log(item.id);      // news item ID (string) or null if not found
  console.log(item.title);   // news headline
  console.log(item.preview); // short preview text or null
}`} />
            <p style={muted}>Return type: <code style={inlineCode}>NewsItem[]</code></p>
            <Callout type="warning">
                <code style={inlineCode}>getNews()</code>, <code style={inlineCode}>getStartpage()</code>, and
                <code style={inlineCode}> getClassStudents()</code> scrape HTML pages rather than calling
                JSON endpoints. They depend on SchoolSoft&apos;s page structure and may break if SchoolSoft changes their HTML layout.
            </Callout>

            {/* ── getStartpage ── */}
            <SectionHeading id="get-startpage">getStartpage()</SectionHeading>
            <p style={muted}>
                Returns upcoming homework and recent test results from the student startpage by
                scraping the HTML. Useful for a quick daily overview.
            </p>
            <CodeBlock language="typescript" code={`const { homework, tests } = await client.getStartpage();

// Upcoming homework
for (const hw of homework) {
  console.log(hw.dateAndSubject); // e.g. 'Monday — Mathematics'
  console.log(hw.title);          // assignment/homework title
  console.log(hw.content);        // string[] — lines of the description
}

// Recent test results
for (const test of tests) {
  console.log(test.title);       // test name
  console.log(test.description); // grade / result text
  console.log(test.link);        // URL to the test detail page, if available
}`} />
            <p style={muted}>Return type: <code style={inlineCode}>StartpageData</code></p>
            <CodeBlock language="typescript" code={`interface StartpageData {
  homework: StartpageHomework[];
  tests:    StartpageTest[];
}

interface StartpageHomework {
  dateAndSubject: string;
  title:          string;
  content:        string[];
}

interface StartpageTest {
  title:       string;
  description: string;
  link:        string | undefined;
}`} />

            {/* ── getClassStudents ── */}
            <SectionHeading id="get-class-students">getClassStudents()</SectionHeading>
            <p style={muted}>
                Returns the list of students in the authenticated user&apos;s class. Scrapes the student
                directory HTML page.
            </p>
            <CodeBlock language="typescript" code={`const students = await client.getClassStudents();
// Returns: ClassStudent[]

for (const s of students) {
  console.log(s.name);    // full display name
  console.log(s.email);   // email address, or null
  console.log(s.address); // home address, or null
}`} />
            <p style={muted}>Return type: <code style={inlineCode}>ClassStudent[]</code></p>
            <CodeBlock language="typescript" code={`interface ClassStudent {
  name:    string;
  email:   string | null;
  address: string | null;
}`} />

            {/*  ADVANCED  */}
            <SectionHeading id="functional-api">Advanced — Functional API</SectionHeading>
            <p style={muted}>
                Every function used internally by <code style={inlineCode}>SchoolsoftClient</code> is also exported
                at the top level. This is useful for serverless functions, functional-style code,
                or when you want to manage session state yourself.
            </p>
            <CodeBlock language="typescript" code={`import {
  simpleLogin,
  mobileLogin,
  mobileGetSession,
  fetchMobileSession,
  mobileRefreshToken,
  verifySession,
  getSession,
  getSchools,
  getLunch,
  getSchedule,
  getAssignmentsForWeek,
  getAssignment,
  getSubjects,
  getSubject,
  getNews,
  getStartpage,
  getClassStudents,
  isoWeek,
} from '@elias4044/ssp-node';

// ── Example: simple login + schedule ──
const school  = 'engelska';
const session = await simpleLogin(school, { username: 'john.doe', password: 'secret' });
const { lessons } = await getSchedule(school, session.cookieHeader, isoWeek(new Date()), 'my-agent/1.0');

// ── Example: mobile login ──
const tokens = await mobileLogin(school, { username: 'john.doe', password: 'secret' });
const info   = await fetchMobileSession(school, tokens.accessToken);
const cookies = await mobileGetSession(school, tokens.accessToken, info?.userId);
const news = await getNews(school, cookies.cookieHeader, 'my-agent/1.0');`} />

            <p style={{ ...muted, marginTop: "0.75rem" }}>
                All data functions share the same signature pattern:
            </p>
            <CodeBlock language="typescript" code={`getXxx(
  school:       string,        // school slug, e.g. 'engelska'
  cookieHeader: string,        // 'JSESSIONID=...; hash=...; usertype=1'
  ...args,                     // endpoint-specific arguments
  userAgent:    string,        // User-Agent header value
): Promise<ReturnType>`} />

            {/* ── Raw requests ── */}
            <SectionHeading id="raw-requests">Advanced — Raw requests</SectionHeading>
            <p style={muted}>
                <code style={inlineCode}>schoolsoftFetch</code> is the underlying HTTP client used by every
                function in the library. It automatically sets the correct <code style={inlineCode}>Origin</code>,
                <code style={inlineCode}> Referer</code>, and <code style={inlineCode}>User-Agent</code> headers required
                by SchoolSoft, and parses the response according to the requested <code style={inlineCode}>responseType</code>.
            </p>
            <CodeBlock language="typescript" code={`import { schoolsoftFetch, ssUrl } from '@elias4044/ssp-node';

// ssUrl() builds a correctly structured SchoolSoft URL
const url = ssUrl('engelska', '/rest-api/student/calendar/lessons/week/22');
// → 'https://sms.schoolsoft.se/engelska/rest-api/student/calendar/lessons/week/22'

const result = await schoolsoftFetch<MyResponseType>(url, 'engelska', {
  method:       'GET',
  headers:      { Cookie: cookieHeader, Accept: 'application/json' },
  responseType: 'json',       // 'json' | 'text' | 'buffer'
  followRedirects: true,      // default true — set false to capture 302s
}, 'my-app/1.0');             // optional User-Agent

console.log(result.status);      // HTTP status code
console.log(result.data);        // parsed body (type T)
console.log(result.headers);     // lowercase key map of all response headers
console.log(result.setCookies);  // string[] — raw Set-Cookie values`} />

            <p style={{ ...muted, marginTop: "0.5rem" }}>
                For even lower-level access, <code style={inlineCode}>rawRequest()</code> is the underlying
                Node <code style={inlineCode}>https</code> wrapper used by <code style={inlineCode}>schoolsoftFetch</code>.
                It follows redirects (up to 5 hops), preserves all <code style={inlineCode}>Set-Cookie</code> headers, and
                returns the raw <code style={inlineCode}>Buffer</code> body.
            </p>
            <CodeBlock language="typescript" code={`import { rawRequest } from '@elias4044/ssp-node';

const raw = await rawRequest('https://sms.schoolsoft.se/engelska/rest-api/session', {
  method:          'GET',
  headers:         { Cookie: cookieHeader },
  followRedirects: false,
  responseType:    'json',
});

console.log(raw.status);     // HTTP status
console.log(raw.body);       // Buffer — parse yourself
console.log(raw.setCookies); // string[]`} />

            {/* ── PKCE utilities ── */}
            <SectionHeading id="pkce-utilities">Advanced — PKCE utilities</SectionHeading>
            <p style={muted}>
                The PKCE helpers used internally by the mobile auth flow are exported for
                use in your own OAuth2 implementations. All crypto uses Node&apos;s built-in
                <code style={inlineCode}> crypto</code> module — no external dependencies.
            </p>
            <CodeBlock language="typescript" code={`import { makePkcePair, makeState, base64url } from '@elias4044/ssp-node';

// Generate a PKCE verifier + SHA-256 challenge pair
const { verifier, challenge } = makePkcePair();
// verifier  — random 32-byte base64url string, kept secret on device
// challenge — SHA-256(verifier) encoded as base64url, sent to auth server

// Generate a random CSRF state token
const state = makeState();
// → 24-char hex string, e.g. 'a3f91c7e2b84d06f1234abcd'

// base64url encode arbitrary data
const encoded = base64url(Buffer.from('hello world'));`} />

            {/* ── Token storage ── */}
            <SectionHeading id="token-storage">Advanced — Token storage pattern</SectionHeading>
            <p style={muted}>
                For apps that need to survive restarts without the user logging in again — mobile
                apps, daemons, bots — persist the refresh token and restore it on startup.
            </p>
            <CodeBlock language="typescript" code={`import { SchoolsoftClient } from '@elias4044/ssp-node';
import fs from 'fs';

const TOKEN_FILE = '.ssp-tokens.json';
const school = 'engelska';

async function getAuthenticatedClient(): Promise<SchoolsoftClient> {
  const client = new SchoolsoftClient({ school });

  // Try to restore saved tokens
  if (fs.existsSync(TOKEN_FILE)) {
    const saved = JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf8'));
    client.setAccessToken(saved.accessToken, saved.refreshToken, saved.expiresAt);

    try {
      // This auto-refreshes if access token is expired
      await client.mobileExchangeSession();

      if (await client.verifySession()) {
        console.log('Session restored from file.');
        return client;
      }
    } catch {
      console.log('Saved session invalid — re-logging in.');
    }
  }

  // Fall back to full login
  const result = await client.mobileLogin({
    username: process.env.SS_USER!,
    password: process.env.SS_PASS!,
  });

  // Persist tokens for next run
  fs.writeFileSync(TOKEN_FILE, JSON.stringify({
    accessToken:  result.accessToken,
    refreshToken: result.refreshToken,
    expiresAt:    result.expiresAt,
  }));

  await client.mobileExchangeSession();
  return client;
}

const client = await getAuthenticatedClient();
const lunch  = await client.getLunch(22);`} />
            <Callout type="danger">
                Never commit token files to source control. Add <code style={inlineCode}>.ssp-tokens.json</code> to
                your <code style={inlineCode}>.gitignore</code>. In production, use a secrets manager or
                environment variables with encrypted storage.
            </Callout>

            {/* ── Error handling ── */}
            <SectionHeading id="error-handling">Advanced — Error handling</SectionHeading>
            <p style={muted}>
                All methods throw a plain <code style={inlineCode}>Error</code> on failure.
                The message includes the HTTP status code and a human-readable description.
                There are no custom error classes — use message inspection or status codes
                from your logging layer to distinguish error types.
            </p>
            <CodeBlock language="typescript" code={`try {
  await client.login({ username: 'bad', password: 'wrong' });
} catch (err) {
  // 'Login failed — unexpected status 200. Check your credentials.'
  console.error(err.message);
}

try {
  await client.getSchedule(22);
} catch (err) {
  if (err.message.includes('Not authenticated')) {
    // Session expired — re-authenticate
    await client.login({ username, password });
    const schedule = await client.getSchedule(22);
  }
}`} />
            <p style={muted}>Common error messages you may encounter:</p>
            <div style={{
                border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden",
                fontSize: "0.8125rem", marginBottom: "1rem",
            }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ background: "var(--surface-raised)", textAlign: "left" }}>
                            {["Error message", "Cause"].map(h => (
                                <th key={h} style={{
                                    padding: "0.4375rem 0.75rem", fontWeight: 600, fontSize: "0.6875rem",
                                    letterSpacing: "0.04em", borderBottom: "1px solid var(--border)",
                                    color: "var(--muted)", whiteSpace: "nowrap",
                                }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            ["Login failed — unexpected status …", "Wrong credentials or school slug."],
                            ["Mobile login failed — no authorization code returned.", "Invalid credentials for mobile flow."],
                            ["Token exchange failed — status …", "PKCE verifier mismatch or expired code."],
                            ["Token refresh failed — status …", "Refresh token expired; user must log in again."],
                            ["Session exchange failed — no JSESSIONID or hash.", "Access token expired and refresh failed."],
                            ["Not authenticated. Call login() or mobileLogin() first.", "Calling a data method before authenticating."],
                            ["No refresh token available.", "Calling mobileRefresh() without a refresh token."],
                            ["Invalid week number: …", "Passing a week number outside the range 1–53."],
                        ].map(([msg, cause], i, arr) => (
                            <tr key={i} style={{ borderBottom: i < arr.length - 1 ? "1px solid var(--border-subtle)" : "none" }}>
                                <td style={{ padding: "0.5rem 0.75rem" }}>
                                    <code style={{ fontFamily: "var(--font-geist-mono, monospace)", color: "var(--accent)", fontSize: "0.75rem" }}>{msg}</code>
                                </td>
                                <td style={{ padding: "0.5rem 0.75rem", color: "var(--muted)", lineHeight: 1.5 }}>{cause}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/*  TYPES  */}
            <SectionHeading id="types">Types reference</SectionHeading>
            <p style={muted}>
                All types are exported from the package root. Import them as named type imports:
            </p>
            <CodeBlock language="typescript" code={`import type {
  SchoolsoftClientOptions,
  SimpleLoginResult,
  MobileLoginResult,
  MobileAuthFlowInit,
  MobileSessionResult,
  MobileSessionOptions,
  SessionInfo, SessionUser, SessionOrganization,
  School,
  LunchMenu, LunchDay, LunchItem,
  ScheduleLesson,
  Assignment, AssignmentDetail,
  Subject, SubjectEntity, SubjectDetail,
  NewsItem,
  StartpageData, StartpageHomework, StartpageTest,
  ClassStudent,
} from '@elias4044/ssp-node';`} />

            {/* ── Client options ── */}
            <SectionHeading id="client-options">Client options</SectionHeading>
            <p style={muted}>
                Options passed to <code style={inlineCode}>new SchoolsoftClient(options)</code>:
            </p>
            <ParamTable
                title="SchoolsoftClientOptions"
                rows={[
                    { name: "school",    type: "string", required: false, description: "School slug from the URL (the part between sms.schoolsoft.se/ and the next /). Defaults to 'engelska'. Use getSchools() to find yours." },
                    { name: "userAgent", type: "string", required: false, description: "Custom User-Agent header sent with all requests. Defaults to 'ssp-node/1.0 (https://github.com/schoolsoftplus/ssp-node)'." },
                ]}
            />
            <p style={muted}>
                The school slug is the only required piece of configuration. You can find your
                school&apos;s slug by visiting <code style={inlineCode}>https://sms.schoolsoft.se</code> and looking at
                the URL after you select your school, or by calling <code style={inlineCode}>getSchools()</code>:
            </p>
            <CodeBlock language="typescript" code={`const schools = await client.getSchools();
const mine = schools.find(s => s.name.toLowerCase().includes('my school name'));
console.log(mine?.id); // e.g. 'carlwahren'

const client2 = new SchoolsoftClient({ school: mine!.id });`} />

            {/* ── Exports ── */}
            <SectionHeading id="exports">All exports</SectionHeading>
            <p style={muted}>Complete list of everything exported by <code style={inlineCode}>@elias4044/ssp-node</code>:</p>
            <CodeBlock language="typescript" code={`// Main class
export { SchoolsoftClient } from './client';

// Auth helpers (functional)
export { simpleLogin } from './auth/simple';
export {
  startMobileFlow, mobileLogin, completeMobileFlow,
  mobileRefreshToken, mobileGetSession, fetchMobileSession,
  verifySession, exchangeCodeForToken,
} from './auth/mobile';

// API functions (functional)
export { getSession }             from './api/session';
export { getSchools }             from './api/schools';
export { getLunch }               from './api/lunch';
export { getSchedule, isoWeek }   from './api/schedule';
export { getAssignmentsForWeek, getAssignment } from './api/assignments';
export { getSubjects, getSubject } from './api/subjects';
export { getNews }                from './api/news';
export { getStartpage }           from './api/startpage';
export { getClassStudents }       from './api/people';

// Utilities
export { makePkcePair, makeState, base64url } from './utils/pkce';
export {
  schoolsoftFetch, rawRequest, ssUrl, extractCookie,
  parseCookieValue, SS_ORIGIN, DEFAULT_UA,
} from './utils/http';
export { decodeLatin1, parseHtml } from './utils/html';

// All types (re-exported as type exports)
export type { SchoolsoftClientOptions, SimpleLoginResult, MobileLoginResult,
  MobileAuthFlowInit, MobileSessionResult, MobileSessionOptions,
  SessionInfo, SessionUser, SessionOrganization, School,
  LunchMenu, LunchDay, LunchItem, ScheduleLesson,
  Assignment, AssignmentDetail, Subject, SubjectEntity, SubjectDetail,
  NewsItem, StartpageData, StartpageHomework, StartpageTest, ClassStudent,
} from './types';`} />
        </DocLayout>
    );
}
