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
    title: "SchoolSoft API Reference",
    description:
        "Unofficial documentation for SchoolSoft's internal REST API - authentication, schedule, lunch, news, subjects, assignments, and more.",
};

const sidebar: SidebarSection[] = [
    {
        title: "Overview",
        items: [
            { id: "introduction", label: "Introduction" },
            { id: "base-url", label: "Base URL" },
            { id: "encoding", label: "Encoding & Format" },
        ],
    },
    {
        title: "Authentication",
        items: [
            { id: "authentication", label: "Login flow" },
            { id: "session-cookies", label: "Session cookies" },
            { id: "session-api", label: "Session endpoint", badge: "GET" },
        ],
    },
    {
        title: "Academic Data",
        items: [
            { id: "schedule", label: "Schedule", badge: "GET" },
            { id: "lunch", label: "Lunch menu", badge: "GET" },
            { id: "news", label: "News (HTML)", badge: "GET" },
            { id: "subjects", label: "Subjects", badge: "GET" },
            { id: "subject-entities", label: "Subject entities", badge: "GET" },
            { id: "assignments", label: "Assignments", badge: "GET" },
        ],
    },
    {
        title: "Internals",
        items: [
            { id: "error-handling", label: "Error handling" },
            { id: "rate-limits", label: "Rate limits & notes" },
        ],
    },
];

export default function SchoolSoftAPIPage() {
    return (
        <DocLayout sections={sidebar}>
            {/* Page title */}
            <div style={{ marginBottom: "2rem" }}>
                <div
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        padding: "0.3rem 0.75rem",
                        borderRadius: "999px",
                        background: "var(--accent-subtle)",
                        border: "1px solid var(--accent-border)",
                        fontSize: "0.75rem",
                        color: "var(--accent)",
                        fontWeight: 600,
                        marginBottom: "1rem",
                        letterSpacing: "0.02em",
                    }}
                >
                    UNOFFICIAL
                </div>
                <h1
                    style={{
                        fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
                        fontWeight: 800,
                        letterSpacing: "-0.03em",
                        color: "var(--foreground)",
                        marginBottom: "0.75rem",
                    }}
                >
                    SchoolSoft API Reference
                </h1>
                <p style={{ fontSize: "1rem", color: "var(--muted)", lineHeight: 1.7, maxWidth: "620px" }}>
                    SchoolSoft does not publish an official public API. This documentation is entirely reverse-engineered
                    by observing network traffic from the SchoolSoft web application. It is the foundation on which
                    SchoolSoft+ is built.
                </p>
            </div>

            <Callout type="warning">
                This API is <strong>unofficial and undocumented</strong>. Endpoints may change without notice.
                SchoolSoft+ does not store your credentials - they are forwarded directly to SchoolSoft over HTTPS
                on every request and never persisted.
            </Callout>

            {/*  Introduction  */}
            <SectionHeading id="introduction">Introduction</SectionHeading>
            <p style={{ color: "var(--muted)", lineHeight: 1.75, marginBottom: "1rem" }}>
                SchoolSoft&apos;s backend is a Java-based web application running at{" "}
                <code style={{ fontFamily: "var(--font-geist-mono, monospace)", color: "var(--accent)" }}>
                    https://sms.schoolsoft.se
                </code>
                . It exposes two types of data surfaces:
            </p>
            <ul
                style={{
                    color: "var(--muted)",
                    lineHeight: 1.8,
                    paddingLeft: "1.25rem",
                    marginBottom: "1rem",
                }}
            >
                <li>
                    <strong style={{ color: "var(--foreground)" }}>REST API</strong> - JSON endpoints under{" "}
                    <code style={{ fontFamily: "var(--font-geist-mono, monospace)", color: "var(--accent)" }}>/rest-api/</code>{" "}
                    that return structured data (schedule, lunch, subjects, session info).
                </li>
                <li>
                    <strong style={{ color: "var(--foreground)" }}>HTML pages</strong> - Legacy JSP pages (e.g. the
                    news feed, staff directory) that SchoolSoft+ scrapes with{" "}
                    <a href="https://cheerio.js.org" style={{ color: "var(--accent)" }}>
                        Cheerio
                    </a>
                    . Responses are ISO-8859-1 encoded and must be decoded to UTF-8.
                </li>
            </ul>

            {/*  Base URL  */}
            <SectionHeading id="base-url">Base URL</SectionHeading>
            <p style={{ color: "var(--muted)", lineHeight: 1.75, marginBottom: "0.75rem" }}>
                Every request targets a school-specific subdirectory. The school slug appears in the URL path and is
                stored client-side in the <code style={{ fontFamily: "var(--font-geist-mono, monospace)", color: "var(--accent)" }}>ssp_school</code> cookie
                after login.
            </p>
            <CodeBlock
                language="text"
                code={`https://sms.schoolsoft.se/{school}/rest-api/...
https://sms.schoolsoft.se/{school}/jsp/...

# Example (school slug = "engelska")
https://sms.schoolsoft.se/engelska/rest-api/session`}
            />
            <p style={{ color: "var(--muted)", lineHeight: 1.7, marginBottom: "0.75rem", fontSize: "0.9rem" }}>
                SchoolSoft+ builds a per-school Axios client for every request:
            </p>
            <CodeBlock
                language="typescript"
                code={`function createSchoolsoftClient(school: string) {
  return axios.create({
    baseURL: \`https://sms.schoolsoft.se/\${school}\`,
    headers: {
      "User-Agent": "Schoolsoft+/1.0 (https://ssp.elias4044.com; +)",
      Referer: \`https://sms.schoolsoft.se/\${school}/\`,
      Origin: "https://sms.schoolsoft.se",
    },
  });
}`}
            />

            {/*  Encoding  */}
            <SectionHeading id="encoding">Encoding &amp; Format</SectionHeading>
            <p style={{ color: "var(--muted)", lineHeight: 1.75, marginBottom: "0.75rem" }}>
                REST endpoints return <strong style={{ color: "var(--foreground)" }}>UTF-8 JSON</strong>. HTML JSP
                pages return <strong style={{ color: "var(--foreground)" }}>ISO-8859-1</strong> (Latin-1) encoded
                HTML. Always request these as <code style={{ fontFamily: "var(--font-geist-mono, monospace)", color: "var(--accent)" }}>arraybuffer</code>{" "}
                and decode with <code style={{ fontFamily: "var(--font-geist-mono, monospace)", color: "var(--accent)" }}>iconv-lite</code>:
            </p>
            <CodeBlock
                language="typescript"
                code={`import iconv from "iconv-lite";

const response = await api.get("/jsp/student/right_student_startpage.jsp", {
  headers: { Cookie: cookieString },
  responseType: "arraybuffer",
});

const html = iconv.decode(response.data as Buffer, "ISO-8859-1");`}
            />

            {/*  Authentication  */}
            <SectionHeading id="authentication">Authentication - Login Flow</SectionHeading>
            <p style={{ color: "var(--muted)", lineHeight: 1.75, marginBottom: "0.75rem" }}>
                SchoolSoft uses form-based authentication. Submitting credentials to the Login JSP endpoint returns a{" "}
                <strong style={{ color: "var(--foreground)" }}>HTTP 302 redirect</strong> on success (or HTTP 200 with
                an error page on failure). The session cookies are extracted from the{" "}
                <code style={{ fontFamily: "var(--font-geist-mono, monospace)", color: "var(--accent)" }}>Set-Cookie</code>{" "}
                response headers.
            </p>

            <EndpointCard
                method="POST"
                path="https://sms.schoolsoft.se/{school}/jsp/Login.jsp"
                description="Authenticate a user. On success, SchoolSoft returns HTTP 302 and sets JSESSIONID, hash, and usertype cookies."
                auth={false}
            >
                <ParamTable
                    title="Form body (application/x-www-form-urlencoded)"
                    rows={[
                        { name: "action", type: "string", required: true, description: 'Always "login"' },
                        { name: "ssusername", type: "string", required: true, description: "SchoolSoft username" },
                        { name: "sspassword", type: "string", required: true, description: "SchoolSoft password (never stored by SSP+)" },
                        { name: "usertype", type: "string", required: true, description: '"1" = student, "2" = teacher, "3" = guardian' },
                    ]}
                />
                <ParamTable
                    title="Required headers"
                    rows={[
                        { name: "Content-Type", type: "string", required: true, description: "application/x-www-form-urlencoded" },
                        { name: "User-Agent", type: "string", required: false, description: "Any browser-like UA string" },
                    ]}
                />
                <p style={{ fontSize: "0.8125rem", color: "var(--muted)", marginBottom: "0.5rem" }}>
                    Success response (302):
                </p>
                <CodeBlock
                    language="http"
                    code={`HTTP/1.1 302 Found
Location: /engelska/jsp/student/right_student_startpage.jsp
Set-Cookie: JSESSIONID=F92FC4EC3A1B...; Path=/; HttpOnly
Set-Cookie: hash=d85914fa8b...; Path=/
Set-Cookie: usertype=1; Path=/`}
                />
                <p style={{ fontSize: "0.8125rem", color: "var(--muted)", marginBottom: "0.5rem" }}>
                    Failure response (200 HTML page with error message):
                </p>
                <CodeBlock
                    language="http"
                    code={`HTTP/1.1 200 OK
Content-Type: text/html; charset=ISO-8859-1
[HTML body containing "Felaktigt användarnamn eller lÃ¶senord"]`}
                />
            </EndpointCard>

            <Callout type="info">
                SchoolSoft+ sets these session cookies as{" "}
                <strong>httpOnly</strong> cookies on the SSP+ domain prefixed with{" "}
                <code style={{ fontFamily: "var(--font-geist-mono, monospace)" }}>ssp_</code> (e.g.{" "}
                <code style={{ fontFamily: "var(--font-geist-mono, monospace)" }}>ssp_jsessionid</code>). They are
                reconstructed into the original format before forwarding to SchoolSoft.
            </Callout>

            {/*  Session Cookies  */}
            <SectionHeading id="session-cookies">Session Cookies</SectionHeading>
            <p style={{ color: "var(--muted)", lineHeight: 1.75, marginBottom: "0.75rem" }}>
                Every subsequent request to SchoolSoft must include all three cookies in the{" "}
                <code style={{ fontFamily: "var(--font-geist-mono, monospace)", color: "var(--accent)" }}>Cookie</code>{" "}
                request header, in this exact format:
            </p>
            <CodeBlock
                language="http"
                code={`Cookie: JSESSIONID=F92FC4EC3A1B...; hash=d85914fa8b...; usertype=1`}
            />

            <SubHeading id="cookie-table">Cookie values</SubHeading>
            <ParamTable
                title="Cookie breakdown"
                rows={[
                    { name: "JSESSIONID", type: "string", required: true, description: "Java EE session token. Required on every request." },
                    { name: "hash", type: "string", required: true, description: "Secondary auth token paired with the session. Include if present." },
                    { name: "usertype", type: "string", required: false, description: '"1" = student, "2" = teacher, "3" = guardian' },
                ]}
            />

            {/*  Session API  */}
            <SectionHeading id="session-api">Session Endpoint</SectionHeading>
            <EndpointCard
                method="GET"
                path="/rest-api/session"
                description="Returns information about the currently authenticated user and their organization. Used by SSP+ to populate profile data on login."
            >
                <CodeBlock
                    language="json"
                    code={`{
  "app": false,
  "superLoggedInAsUser": false,
  "printLogoUrl": "/engelska/jsp/logoFile.jsp?logoname=print_logo.png",
  "organization": {
    "id": 18,
    "name": "IES Halmstad",
    "school": true
  },
  "samlRedirect": false,
  "theme": "light",
  "language": {
    "langId": 2,
    "langCode": "en"
  },
  "userType": {
    "id": 1,
    "name": "student"
  },
  "adminLoggedInAsUser": false,
  "user": {
    "id": 104801,
    "firstName": "Elias",
    "lastName": "Gulam",
    "userName": "elias.gulam",
    "email": "elias.gulam.student.halmstad@engelska.se"
  },
  "hasProtectedIdentityViewAccess": false,
  "superUser": false
}`}
                />
            </EndpointCard>

            {/*  Schedule  */}
            <SectionHeading id="schedule">Schedule</SectionHeading>
            <p style={{ color: "var(--muted)", lineHeight: 1.75, marginBottom: "0.75rem" }}>
                Returns all lesson events for a given ISO week number. The endpoint returns an array (or sometimes an
                object whose values are the lessons). SchoolSoft+ de-duplicates by{" "}
                <code style={{ fontFamily: "var(--font-geist-mono, monospace)", color: "var(--accent)" }}>startDate+endDate</code>{" "}
                key and sorts ascending.
            </p>
            <EndpointCard
                method="GET"
                path="/rest-api/student/calendar/lessons/week/{week}"
                description="Returns all scheduled lessons for the given ISO week. Week must be between 1â€“53."
            >
                <ParamTable
                    title="Path parameters"
                    rows={[
                        { name: "week", type: "number", required: true, description: "ISO week number (1â€“53). Current week is used if omitted by the caller." },
                    ]}
                />
                <CodeBlock
                    language="json"
                    code={`[
 {
    "eventId": 2987698,
    "name": "Math",
    "description": "Math",
    "startDate": "2026-05-04T13:20",
    "endDate": "2026-05-04T14:25",
    "allDay": false,
    "eventColor": "#70b2ed",
    "editable": false,
    "room": "314",
    "teachingGroup": "8B MATH,8B/20251MATH",
    "teacher": "Math Teacher",
    "dayId": 0, 
    "status": -1,
    "category": "lesson",
    "roomBooking": false
  },
  ...
]`}
                />
            </EndpointCard>

            {/*  Lunch  */}
            <SectionHeading id="lunch">Lunch Menu</SectionHeading>
            <EndpointCard
                method="GET"
                path="/rest-api/lunchmenu/week/{week}"
                description="Returns the weekly lunch menu for the school. Structure varies per school - some return day arrays, others return an object."
            >
                <ParamTable
                    title="Path parameters"
                    rows={[
                        { name: "week", type: "number", required: true, description: "ISO week number (1â€“53)." },
                    ]}
                />
                <CodeBlock
                    language="json"
                    code={`[
  {
    "dayId": 1,
    "dishes": [
      {
        "dishType": "Lunch",
        "dish": "Tacogryta serveras med ris \r\n\r\nTacogryta serveras med ris"
      }
    ]
  },
  {
    "dayId": 2,
    "dishes": [
      {
        "dishType": "Lunch",
        "dish": "GrÃ¶nsaksgratäng citron & dill serveras med potatis \r\n\r\nFiskgratäng citron & dill serveras med potatis"
      }
    ]
  },
  {
    "dayId": 3,
    "dishes": [
      {
        "dishType": "Lunch",
        "dish": "GrÃ¶nsakspytt med vitlÃ¶ksdressing \r\n\r\nPyttipanna med vitlÃ¶ksdressing "
      }
    ]
  },
  {
    "dayId": 4,
    "dishes": [
      {
        "dishType": "Lunch",
        "dish": "Tikka Masala med linser serveras med ris \r\n\r\nTikka Masala serveras med ris"
      }
    ]
  },
  {
    "dayId": 5,
    "dishes": [
      {
        "dishType": "Lunch",
        "dish": "Veg. carbonara serveras med pasta \r\n\r\nCarbonara serveras med pasta"
      }
    ]
  }
]`}
                />
            </EndpointCard>

            {/*  News  */}
            <SectionHeading id="news">News (HTML Scraping)</SectionHeading>
            <p style={{ color: "var(--muted)", lineHeight: 1.75, marginBottom: "0.75rem" }}>
                SchoolSoft does not expose news as a REST endpoint. Instead, news items are embedded in the student
                start-page HTML. SchoolSoft+ fetches this page and scrapes it with Cheerio.
            </p>
            <EndpointCard
                method="GET"
                path="/jsp/student/right_student_startpage.jsp"
                description="The student start page. SchoolSoft+ scrapes the #news_con_content table to extract news items. Response is ISO-8859-1 HTML."
            >
                <Callout type="info">
                    This endpoint returns HTML, not JSON. The response must be decoded from ISO-8859-1 before parsing.
                </Callout>
                <p style={{ fontSize: "0.8125rem", color: "var(--muted)", margin: "0.5rem 0" }}>
                    Relevant DOM structure (simplified):
                </p>
                <CodeBlock
                    language="html"
                    code={`<div id="news_con_content">
  <table>
    <tr>
      <a class="toplist-item" href="...requestid=4821...">
        <div class="heading_bold">Studiedag 14 januari</div>
        <div>Skolan håller stängt måndag den 14 januari...</div>
      </a>
    </tr>
  </table>
</div>`}
                />
                <p style={{ fontSize: "0.8125rem", color: "var(--muted)", margin: "0.5rem 0" }}>
                    Parsed output:
                </p>
                <CodeBlock
                    language="json"
                    code={`[
  {
    "id":      "4821",
    "title":   "Studiedag 14 januari",
    "preview": "Skolan håller stängt måndag den 14 januari..."
  }
]`}
                />
            </EndpointCard>

            {/*  Subjects  */}
            <SectionHeading id="subjects">Subjects</SectionHeading>
            <EndpointCard
                method="GET"
                path="/rest-api/student/ps/subjectroom/all"
                description="Returns all subject rooms the student is enrolled in. Each item contains an activityId used to fetch sub-resources."
            >
                <CodeBlock
                    language="json"
                    code={`[
  {
    "activityId": "1042",
    "name":       "Matematik 2b",
    "courseCode": "MATMAT02b",
    "period":     "HT 2024",
    "groupName":  "MA2b-A"
  },
  ...
]`}
                />
            </EndpointCard>

            {/*  Subject Entities  */}
            <SectionHeading id="subject-entities">Subject Entities &amp; Teachers</SectionHeading>
            <p style={{ color: "var(--muted)", lineHeight: 1.75, marginBottom: "0.75rem" }}>
                For each subject, SchoolSoft+ fetches three additional endpoints in parallel to enrich the data:
            </p>
            <EndpointCard
                method="GET"
                path="/rest-api/student/ps/subjectroom/{activityId}/entities"
                description="Returns all entities (assignments and planning items) for a subject room."
            >
                <CodeBlock
                    language="json"
                    code={`[
  {
    "planningId": null,
    "assignmentId": "8821",
    "title":        "Derivatans tillämpningar",
    "description":  "LÃ¶s uppgifterna på sida 142â€“148.",
    "deadline":     "2025-01-17T23:59:00",
    "status":       "assigned"
  }
]`}
                />
            </EndpointCard>
            <EndpointCard
                method="GET"
                path="/rest-api/student/ps/subjectroom/{activityId}/unread_entities"
                description="Returns a plain integer - the count of unread entities in the subject room."
            >
                <CodeBlock language="text" code={`3`} />
            </EndpointCard>
            <EndpointCard
                method="GET"
                path="/rest-api/student/ps/subjectroom/{activityId}/teachers"
                description="Returns an array of teacher objects associated with the subject room."
            >
                <CodeBlock
                    language="json"
                    code={`[
  {
    "firstName": "Erik",
    "lastName":  "Svensson",
    "email":     "erik.svensson@engelska.se"
  }
]`}
                />
            </EndpointCard>

            {/*  Assignments  */}
            <SectionHeading id="assignments">Assignments</SectionHeading>
            <EndpointCard
                method="GET"
                path="/rest-api/student/assignments/week/{week}"
                description="Returns all assignments due in the given ISO week, across all subjects."
            >
                <CodeBlock
                    language="json"
                    code={`[
  {
    "assignmentId": "8821",
    "subjectName":  "Matematik 2b",
    "title":        "Derivatans tillämpningar",
    "deadline":     "2025-01-17T23:59:00",
    "status":       "assigned"
  }
]`}
                />
            </EndpointCard>

            {/*  Error handling  */}
            <SectionHeading id="error-handling">Error Handling</SectionHeading>
            <p style={{ color: "var(--muted)", lineHeight: 1.75, marginBottom: "0.75rem" }}>
                SchoolSoft returns non-standard status codes in some cases. SchoolSoft+ normalises these before
                returning them to the client. Common scenarios:
            </p>
            <ParamTable
                title="Status codes observed from SchoolSoft"
                rows={[
                    { name: "302", type: "redirect", required: false, description: "Successful login. Cookies are in Set-Cookie headers." },
                    { name: "200", type: "html", required: false, description: "Login failed - body is an error HTML page." },
                    { name: "401", type: "json/html", required: false, description: "Session expired. Re-authentication required." },
                    { name: "404", type: "html", required: false, description: "Resource not found or wrong school slug." },
                    { name: "500", type: "html", required: false, description: "Internal SchoolSoft error (rare, typically transient)." },
                ]}
            />

            {/*  Rate limits  */}
            <SectionHeading id="rate-limits">Rate Limits &amp; Notes</SectionHeading>
            <Callout type="warning">
                SchoolSoft does not document rate limits. Aggressive polling will likely result in a temporary IP or
                session ban. SchoolSoft+ caches responses where possible and avoids redundant requests.
            </Callout>
            <ul style={{ color: "var(--muted)", lineHeight: 1.8, paddingLeft: "1.25rem" }}>
                <li>The school slug is case-sensitive and must exactly match what SchoolSoft expects.</li>
                <li>
                    REST endpoints require the{" "}
                    <code style={{ fontFamily: "var(--font-geist-mono, monospace)", color: "var(--accent)" }}>Accept: application/json</code>{" "}
                    header to receive JSON; without it, some endpoints return HTML.
                </li>
                <li>The JSESSIONID expires after a period of inactivity - SchoolSoft+ re-validates on every API call.</li>
                <li>All times returned by SchoolSoft are in the Europe/Stockholm time zone (CET/CEST).</li>
            </ul>
        </DocLayout>
    );
}

