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
  title: "SchoolSoft+ API Routes",
  description:
    "Full reference for all HTTP routes exposed by SchoolSoft+. Covers auth, academic data, social, notes, countdowns, presence, and more.",
};

const sidebar: SidebarSection[] = [
  {
    title: "Overview",
    items: [
      { id: "introduction", label: "Introduction" },
      { id: "auth-model",   label: "Auth model" },
      { id: "error-format", label: "Error format" },
    ],
  },
  {
    title: "Auth",
    items: [
      { id: "login",   label: "Login",   badge: "POST" },
      { id: "logout",  label: "Logout",  badge: "POST" },
      { id: "session", label: "Session", badge: "GET"  },
    ],
  },
  {
    title: "Academic",
    items: [
      { id: "schedule",    label: "Schedule",    badge: "GET" },
      { id: "lunch",       label: "Lunch menu",  badge: "GET" },
      { id: "news",        label: "News",        badge: "GET" },
      { id: "subjects",    label: "Subjects",    badge: "GET" },
      { id: "assignments", label: "Assignments", badge: "GET" },
    ],
  },
  {
    title: "Social",
    items: [
      { id: "conversations", label: "Conversations", badge: "GET" },
      { id: "friends",       label: "Friends",       badge: "GET" },
      { id: "presence",      label: "Presence",      badge: "PATCH" },
      { id: "group-invites", label: "Group invites",  badge: "GET" },
    ],
  },
  {
    title: "User data",
    items: [
      { id: "profile",    label: "Profile",    badge: "GET" },
      { id: "notes",      label: "Notes",      badge: "GET" },
      { id: "countdowns", label: "Countdowns", badge: "GET" },
    ],
  },
  {
    title: "People",
    items: [
      { id: "people-class",  label: "Class list",  badge: "GET" },
      { id: "people-staff",  label: "Staff list",  badge: "GET" },
      { id: "users-search",  label: "User search", badge: "GET" },
    ],
  },
  {
    title: "Misc",
    items: [
      { id: "stats",   label: "Stats",   badge: "GET" },
      { id: "version", label: "Version", badge: "GET" },
    ],
  },
];

const P = ({ children }: { children: React.ReactNode }) => (
  <p style={{ color: "var(--muted)", lineHeight: 1.75, marginBottom: "0.75rem", fontSize: "0.9375rem" }}>
    {children}
  </p>
);

export default function SSPRoutesPage() {
  return (
    <DocLayout sections={sidebar}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.3rem 0.75rem",
            borderRadius: "999px",
            background: "rgba(139,92,246,0.1)",
            border: "1px solid rgba(139,92,246,0.25)",
            fontSize: "0.75rem",
            color: "#a78bfa",
            fontWeight: 600,
            marginBottom: "1rem",
            letterSpacing: "0.02em",
          }}
        >
          SCHOOLSOFT+ ROUTES
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
          SSP+ API Routes
        </h1>
        <P>
          Complete reference for every HTTP route exposed by the SchoolSoft+ Next.js application. All routes
          live under <code style={{ fontFamily: "var(--font-geist-mono, monospace)", color: "#a78bfa" }}>/api/</code>{" "}
          and are handled by Next.js Route Handlers (App Router). Requests and responses use{" "}
          <strong style={{ color: "var(--foreground)" }}>JSON</strong> unless otherwise noted.
        </P>
      </div>

      {/*  Auth model  */}
      <SectionHeading id="introduction">Introduction</SectionHeading>
      <P>
        SchoolSoft+ acts as a proxy between your browser and SchoolSoft. When you log in, SSP+ forwards your
        credentials to SchoolSoft, extracts the resulting session cookies, and stores them as{" "}
        <strong style={{ color: "var(--foreground)" }}>httpOnly cookies</strong> on the SSP+ domain. Your
        password is never stored.
      </P>
      <P>
        Subsequent requests to SSP+ routes reconstruct the SchoolSoft cookies from the stored SSP+ cookies
        and forward them to SchoolSoft&apos;s API, then return the response (transformed or enriched) back to
        the client.
      </P>

      <SectionHeading id="auth-model">Auth Model</SectionHeading>
      <P>
        Most routes call{" "}
        <code style={{ fontFamily: "var(--font-geist-mono, monospace)", color: "#a78bfa" }}>getSessionCookies(req)</code>{" "}
        to extract SSP+ cookies, then call{" "}
        <code style={{ fontFamily: "var(--font-geist-mono, monospace)", color: "#a78bfa" }}>authUser(cookies, school)</code>{" "}
        to validate the session against SchoolSoft&apos;s{" "}
        <code style={{ fontFamily: "var(--font-geist-mono, monospace)", color: "#a78bfa" }}>/rest-api/session</code>{" "}
        endpoint before serving the request.
      </P>

      <SubHeading id="cookies-table">SSP+ cookies</SubHeading>
      <ParamTable
        title="Cookies set by SSP+ on login"
        rows={[
          { name: "ssp_jsessionid", type: "string",  required: true,  description: "Mirrors SchoolSoft JSESSIONID. httpOnly." },
          { name: "ssp_hash",       type: "string",  required: true, description: "Mirrors SchoolSoft hash cookie. httpOnly." },
          { name: "ssp_usertype",   type: "string",  required: false, description: '"1" student | "2" teacher | "3" guardian. httpOnly.' },
          { name: "ssp_school",     type: "string",  required: true,  description: "School slug (e.g. \"engelska\"). httpOnly." },
          { name: "ssp_username",   type: "string",  required: true,  description: "Lowercase SchoolSoft username. httpOnly." },
        ]}
      />

      <SectionHeading id="error-format">Error Format</SectionHeading>
      <P>All error responses follow a consistent JSON shape:</P>
      <CodeBlock
        language="json"
        code={`{
  "success": false,
  "error": "Human-readable error message."
}`}
      />
      <ParamTable
        title="Common HTTP status codes"
        rows={[
          { name: "400", type: "Bad Request",   required: false, description: "Missing or invalid parameters." },
          { name: "401", type: "Unauthorized",  required: false, description: "Not authenticated or session expired." },
          { name: "403", type: "Forbidden",     required: false, description: "Authenticated but not allowed (e.g. DM privacy)." },
          { name: "404", type: "Not Found",     required: false, description: "Resource does not exist." },
        { name: "429", type: "Too Many Req.", required: false, description: "Rate limit exceeded." },
          { name: "500", type: "Server Error",  required: false, description: "Unexpected error - check server logs." },
        ]}
      />

      {/* - */}
      {/*  AUTH ROUTES                                          */}
      {/* - */}
      <SectionHeading id="login">POST /api/login</SectionHeading>
      <P>
        Authenticates against SchoolSoft using the provided credentials. On success, sets httpOnly SSP+
        session cookies and upserts a Firestore profile document.
      </P>
      <EndpointCard
        method="POST"
        path="/api/login"
        description="Log in with SchoolSoft credentials. Returns user profile data on success and sets httpOnly session cookies."
        auth={false}
      >
        <ParamTable
          title="Request headers"
          rows={[
            { name: "x-school",     type: "string", required: false, description: "School slug. Defaults to \"engelska\" if omitted." },
            { name: "Content-Type", type: "string", required: true,  description: "application/json" },
          ]}
        />
        <ParamTable
          title="JSON body"
          rows={[
            { name: "username", type: "string", required: true,  description: "SchoolSoft username." },
            { name: "password", type: "string", required: true,  description: "SchoolSoft password." },
            { name: "usertype", type: "string", required: false, description: '"1" (student, default) | "2" (teacher) | "3" (guardian)' },
          ]}
        />
        <CodeBlock
          language="json"
          code={`// 200 OK
{
  "success": true,
  "message": "Login successful.",
  "user": {
    "username":   "anna.lindqvist",
    "firstName":  "Anna",
    "lastName":   "Lindqvist",
    "school":     "engelska",
    "userType":   "Student",
    "firebaseToken": "<custom-firebase-jwt>"
  }
}`}
        />
      </EndpointCard>

      <SectionHeading id="logout">POST /api/logout</SectionHeading>
      <EndpointCard
        method="POST"
        path="/api/logout"
        description="Clears all SSP+ session cookies. Optionally invalidates the SchoolSoft session server-side."
        auth={false}
      >
        <CodeBlock language="json" code={`{ "success": true, "message": "Logged out." }`} />
      </EndpointCard>

      <SectionHeading id="session">GET /api/session</SectionHeading>
      <EndpointCard
        method="GET"
        path="/api/session"
        description="Returns the current session info by forwarding the stored cookies to SchoolSoft's /rest-api/session and enriching the response with SSP+ metadata."
      >
        <CodeBlock
          language="json"
          code={`{
  "success": true,
  "session": {
    "user": {
      "firstName": "Anna",
      "lastName":  "Lindqvist",
      "email":     "anna.lindqvist@example.com"
    },
    "organization": { "name": "Engelska Skolan Gottsunda" },
    "userType":     { "name": "Student" },
    "school":    "engelska",
    "username":  "anna.lindqvist"
  }
}`}
        />
      </EndpointCard>

      {/* - */}
      {/*  ACADEMIC ROUTES                                      */}
      {/* - */}
      <SectionHeading id="schedule">GET /api/schedule</SectionHeading>
      <P>
        Proxies SchoolSoft&apos;s{" "}
        <code style={{ fontFamily: "var(--font-geist-mono, monospace)", color: "#a78bfa" }}>
          /rest-api/student/calendar/lessons/week/{"{week}"}
        </code>{" "}
        endpoint. De-duplicates lessons by{" "}
        <code style={{ fontFamily: "var(--font-geist-mono, monospace)", color: "#a78bfa" }}>startDate+endDate</code>{" "}
        and sorts ascending.
      </P>
      <EndpointCard
        method="GET"
        path="/api/schedule"
        description="Returns the deduplicated, sorted lesson schedule for the requested ISO week."
      >
        <ParamTable
          title="Query parameters"
          rows={[
            { name: "week", type: "number", required: false, description: "ISO week number 1â€“53. Defaults to current week." },
          ]}
        />
        <CodeBlock
          language="json"
          code={`{
  "success":  true,
  "week":     3,
  "schedule": [
    {
      "eventId":      "4209183",
      "name":         "Matematik",
      "startDate":    "2025-01-13T08:00:00",
      "endDate":      "2025-01-13T09:00:00",
      "locationName": "B204",
      "teacher":      "Erik Svensson",
      "color":        "#5b9bd5"
    }
  ]
}`}
        />
      </EndpointCard>

      <SectionHeading id="lunch">GET /api/lunch</SectionHeading>
      <EndpointCard
        method="GET"
        path="/api/lunch"
        description="Proxies SchoolSoft's lunch menu endpoint for the requested week."
      >
        <ParamTable
          title="Query parameters"
          rows={[
            { name: "week", type: "number", required: true, description: "ISO week number." },
          ]}
        />
        <CodeBlock
          language="json"
          code={`{
  "success": true,
  "data": {
    "days": [
      { "day": "Monday",  "menu": "Pasta Bolognese" },
      { "day": "Tuesday", "menu": "Fish and chips"  }
    ]
  }
}`}
        />
      </EndpointCard>

      <SectionHeading id="news">GET /api/news</SectionHeading>
      <P>
        Fetches and HTML-scrapes SchoolSoft&apos;s student start page. Extracts news article IDs and titles
        from the{" "}
        <code style={{ fontFamily: "var(--font-geist-mono, monospace)", color: "#a78bfa" }}>#news_con_content</code>{" "}
        table using Cheerio.
      </P>
      <EndpointCard
        method="GET"
        path="/api/news"
        description="Returns a list of news items scraped from SchoolSoft's student start page."
      >
        <CodeBlock
          language="json"
          code={`{
  "success": true,
  "data": [
    {
      "id":      "4821",
      "title":   "Studiedag 14 januari",
      "preview": "Skolan håller stngt måndag den 14 januari..."
    }
  ]
}`}
        />
      </EndpointCard>

      <SectionHeading id="subjects">GET /api/subjects</SectionHeading>
      <P>
        Fetches all subject rooms and enriches each with entities (assignments + planning items), unread
        counts, and teachers - via three parallel requests per subject.
      </P>
      <EndpointCard
        method="GET"
        path="/api/subjects"
        description="Returns all subjects enriched with entities, unread counts, and teachers."
      >
        <CodeBlock
          language="json"
          code={`{
  "success": true,
  "subjects": [
    {
      "activityId":    "1042",
      "name":          "Matematik 2b",
      "courseCode":    "MATMAT02b",
      "id":            "1042",
      "entities": [
        {
          "assignmentId": "8821",
          "title":        "Derivatans tillämpningar",
          "deadline":     "2025-01-17T23:59:00",
          "entityType":   "ASSIGNMENT"
        }
      ],
      "unreadEntities": 2,
      "teachers": [{ "firstName": "Erik", "lastName": "Svensson" }]
    }
  ]
}`}
        />
      </EndpointCard>

      <SectionHeading id="assignments">GET /api/assignments/week &amp; GET /api/assignment/[id]</SectionHeading>
      <EndpointCard
        method="GET"
        path="/api/assignments/week"
        description="Returns all assignments for the current or specified week, across all subjects."
      >
        <ParamTable
          title="Query parameters"
          rows={[{ name: "week", type: "number", required: false, description: "ISO week number. Defaults to current week." }]}
        />
        <CodeBlock
          language="json"
          code={`{
  "success": true,
  "assignments": [
    {
      "assignmentId": "8821",
      "subjectName":  "Matematik 2b",
      "title":        "Derivatans tillämpningar",
      "deadline":     "2025-01-17T23:59:00",
      "status":       "assigned"
    }
  ]
}`}
        />
      </EndpointCard>
      <EndpointCard
        method="GET"
        path="/api/assignment/[id]"
        description="Returns full details for a single assignment including description, attachments, and submission status."
      >
        <ParamTable
          title="Path parameters"
          rows={[{ name: "id", type: "string", required: true, description: "Assignment ID from subject entities." }]}
        />
      </EndpointCard>

      {/* - */}
      {/*  SOCIAL ROUTES                                        */}
      {/* - */}
      <SectionHeading id="conversations">Conversations</SectionHeading>
      <P>
        Conversations are stored in Firestore (<code style={{ fontFamily: "var(--font-geist-mono, monospace)", color: "#a78bfa" }}>conversations_v1</code>).
        Both direct messages (DMs) and group chats are supported. Group chats can optionally be end-to-end encrypted.
      </P>
      <EndpointCard
        method="GET"
        path="/api/conversations"
        description="Returns all conversations the current user is a participant in."
      >
        <CodeBlock
          language="json"
          code={`{
  "success": true,
  "conversations": [
    {
      "id":          "conv_abc123",
      "type":        "dm",
      "participants": [
        { "username": "anna.lindqvist", "displayName": "Anna Lindqvist", "pfpUrl": "..." }
      ],
      "lastMessage":  { "text": "Hey!", "sentAt": 1705161600000 },
      "createdAt":    1705161600000,
      "encrypted":    false
    }
  ]
}`}
        />
      </EndpointCard>
      <EndpointCard
        method="POST"
        path="/api/conversations"
        description="Create a DM or group chat. DMs are idempotent - if a DM between the two users already exists, it is returned instead."
      >
        <ParamTable
          title="JSON body - DM"
          rows={[
            { name: "type",           type: "string",   required: false, description: '"dm" (default)' },
            { name: "targetUsername", type: "string",   required: true,  description: "The other participant's username." },
          ]}
        />
        <ParamTable
          title="JSON body - Group"
          rows={[
            { name: "type",             type: "string",   required: true,  description: '"group"' },
            { name: "groupName",        type: "string",   required: true,  description: "Display name for the group." },
            { name: "groupDescription", type: "string",   required: false, description: "Optional description." },
            { name: "members",          type: "string[]", required: true,  description: "Array of usernames to add (min 1, max 49 + creator)." },
            { name: "encrypted",        type: "boolean",  required: false, description: "Enable AES-256-GCM E2EE for this group." },
          ]}
        />
      </EndpointCard>

      <SubHeading id="messages">Messages</SubHeading>
      <EndpointCard
        method="GET"
        path="/api/conversations/[conversationId]/messages"
        description="Returns paginated messages for a conversation. Messages are ordered newest-first."
      >
        <ParamTable
          title="Query parameters"
          rows={[
            { name: "limit",  type: "number", required: false, description: "Messages per page. Default 30." },
            { name: "before", type: "number", required: false, description: "Unix ms timestamp - return messages before this." },
          ]}
        />
      </EndpointCard>
      <EndpointCard
        method="POST"
        path="/api/conversations/[conversationId]/messages"
        description="Send a message to a conversation."
      >
        <ParamTable
          title="JSON body"
          rows={[
            { name: "text",         type: "string",  required: false, description: "Plaintext content (or ciphertext for E2EE)." },
            { name: "gifUrl",       type: "string",  required: false, description: "Giphy GIF URL." },
            { name: "encrypted",    type: "boolean", required: false, description: "Mark message as E2EE ciphertext." },
            { name: "iv",           type: "string",  required: false, description: "AES-GCM IV (base64), required if encrypted=true." },
          ]}
        />
      </EndpointCard>

      <SectionHeading id="friends">Friends</SectionHeading>
      <EndpointCard
        method="GET"
        path="/api/friends"
        description="Returns the current user's friend list plus pending incoming and outgoing friend requests, each enriched with profile data."
      >
        <CodeBlock
          language="json"
          code={`{
  "success": true,
  "friends":  [{ "userA": "anna.lindqvist", "userB": "kalle.persson", "status": "accepted" }],
  "received": [{ "requestedBy": "maja.eriksson", "status": "pending" }],
  "sent":     [{ "userA": "anna.lindqvist", "userB": "lena.holm", "status": "pending" }],
  "profileMap": {
    "kalle.persson": { "displayName": "Kalle Persson", "pfpUrl": "...", "schoolName": "Engelska" }
  }
}`}
        />
      </EndpointCard>
      <EndpointCard
        method="POST"
        path="/api/friends"
        description="Send a friend request to another SchoolSoft+ user."
      >
        <ParamTable
          title="JSON body"
          rows={[{ name: "targetUsername", type: "string", required: true, description: "Username of the user to befriend." }]}
        />
      </EndpointCard>
      <EndpointCard
        method="PATCH"
        path="/api/friends"
        description="Accept or decline a pending friend request."
      >
        <ParamTable
          title="JSON body"
          rows={[
            { name: "friendshipId", type: "string", required: true,  description: "Firestore document ID of the friendship." },
            { name: "action",       type: "string", required: true,  description: '"accept" | "decline"' },
          ]}
        />
      </EndpointCard>
      <EndpointCard
        method="DELETE"
        path="/api/friends"
        description="Remove an existing friendship."
      >
        <ParamTable
          title="Query parameters"
          rows={[{ name: "friendshipId", type: "string", required: true, description: "Firestore document ID." }]}
        />
      </EndpointCard>

      <SectionHeading id="presence">PATCH /api/presence</SectionHeading>
      <P>
        Updates the current user&apos;s presence status in Firestore (
        <code style={{ fontFamily: "var(--font-geist-mono, monospace)", color: "#a78bfa" }}>presence_v1</code>
        ). The client calls this on an interval. Presence is interpreted by the frontend as:
      </P>
      <ul style={{ color: "var(--muted)", lineHeight: 1.8, paddingLeft: "1.25rem", marginBottom: "0.75rem" }}>
        <li><strong style={{ color: "#4ade80" }}>Online</strong> - last heartbeat &lt; 3 minutes ago</li>
        <li><strong style={{ color: "#facc15" }}>In SchoolSoft+</strong> - last heartbeat 3â€“15 minutes ago</li>
        <li><strong style={{ color: "var(--muted)" }}>Offline</strong> - last heartbeat &gt; 15 minutes ago</li>
      </ul>
      <EndpointCard
        method="PATCH"
        path="/api/presence"
        description='Update the authenticated user&apos;s presence. Call every 2â€“3 minutes to maintain "online" status.'
      >
        <ParamTable
          title="JSON body"
          rows={[
            { name: "status", type: "string", required: false, description: '"online" | "idle" | "offline". Defaults to "online".' },
          ]}
        />
        <CodeBlock language="json" code={`{ "success": true, "status": "online" }`} />
      </EndpointCard>

      <SectionHeading id="group-invites">Group Invites</SectionHeading>
      <EndpointCard
        method="GET"
        path="/api/group-invites"
        description="Returns all pending group chat invites for the current user."
      />
      <EndpointCard
        method="POST"
        path="/api/group-invites"
        description="Create a group invite - admin-only. Sends an invite to a user to join a group conversation."
      >
        <ParamTable
          title="JSON body"
          rows={[
            { name: "conversationId", type: "string", required: true, description: "Group chat ID." },
            { name: "targetUsername", type: "string", required: true, description: "Username to invite." },
          ]}
        />
      </EndpointCard>
      <EndpointCard
        method="PATCH"
        path="/api/group-invites"
        description="Accept or decline a group invite."
      >
        <ParamTable
          title="JSON body"
          rows={[
            { name: "inviteId", type: "string", required: true, description: "Firestore invite document ID." },
            { name: "action",   type: "string", required: true, description: '"accept" | "decline"' },
          ]}
        />
      </EndpointCard>

      {/* - */}
      {/*  USER DATA ROUTES                                     */}
      {/* - */}
      <SectionHeading id="profile">Profile</SectionHeading>
      <P>
        Profiles are stored in Firestore (
        <code style={{ fontFamily: "var(--font-geist-mono, monospace)", color: "#a78bfa" }}>profiles_v1</code>
        ). The{" "}
        <code style={{ fontFamily: "var(--font-geist-mono, monospace)", color: "#a78bfa" }}>PUT</code>{" "}
        endpoint also re-fetches{" "}
        <code style={{ fontFamily: "var(--font-geist-mono, monospace)", color: "#a78bfa" }}>/rest-api/session</code>{" "}
        to keep first/last name, email, and school name in sync with SchoolSoft, and propagates display name
        and profile picture changes to all existing conversations.
      </P>
      <EndpointCard
        method="GET"
        path="/api/profile"
        description="Returns the current user's SSP+ profile."
      >
        <CodeBlock
          language="json"
          code={`{
  "success": true,
  "profile": {
    "username":    "anna.lindqvist",
    "displayName": "Anna",
    "firstName":   "Anna",
    "lastName":    "Lindqvist",
    "bio":         "Student @ Engelska",
    "pfpUrl":      "https://firebasestorage.googleapis.com/...",
    "accentColor": "var(--accent)",
    "pronouns":    "she/her",
    "dmPrivacy":   "everyone",
    "schoolName":  "Engelska Skolan Gottsunda"
  }
}`}
        />
      </EndpointCard>
      <EndpointCard
        method="PUT"
        path="/api/profile"
        description="Update the current user's profile. All fields are optional. Changes to displayName and pfpUrl are propagated to all conversations."
      >
        <ParamTable
          title="JSON body (all optional)"
          rows={[
            { name: "displayName",  type: "string", required: false, description: "Public display name. Max 80 chars." },
            { name: "bio",          type: "string", required: false, description: "Short bio. Max 500 chars." },
            { name: "pronouns",     type: "string", required: false, description: "e.g. \"she/her\". Max 40 chars." },
            { name: "location",     type: "string", required: false, description: "Location text. Max 80 chars." },
            { name: "website",      type: "string", required: false, description: "Must start with https://. Max 200 chars." },
            { name: "pfpUrl",       type: "string", required: false, description: "Profile picture URL. Max 500 chars." },
            { name: "accentColor",  type: "string", required: false, description: "Hex color, e.g. \"#6366f1\". Max 30 chars." },
            { name: "dmPrivacy",    type: "string", required: false, description: '"everyone" | "nobody"' },
          ]}
        />
      </EndpointCard>

      <SectionHeading id="notes">Notes</SectionHeading>
      <P>
        Notes are stored in Firestore (
        <code style={{ fontFamily: "var(--font-geist-mono, monospace)", color: "#a78bfa" }}>notes_v2</code>
        ) and support rich text (Tiptap JSON). Notes can be published to a public share link.
      </P>
      <EndpointCard method="GET"    path="/api/notes"      description="List all notes for the current user." />
      <EndpointCard method="POST"   path="/api/notes"      description="Create a new note.">
        <ParamTable
          title="JSON body"
          rows={[
            { name: "title",   type: "string", required: false, description: "Note title. Defaults to \"Untitled\"." },
            { name: "content", type: "string", required: false, description: "Rich-text content (Tiptap JSON string or plain text)." },
            { name: "status",  type: "string", required: false, description: '"draft" (default) | "published" | "archived"' },
          ]}
        />
        <CodeBlock
          language="json"
          code={`{
  "success": true,
  "note": {
    "id":          "note_xyz789",
    "title":       "Study notes week 3",
    "content":     "{\"type\":\"doc\", ...}",
    "status":      "draft",
    "shareToken":  null,
    "createdAt":   1705161600000,
    "updatedAt":   1705161600000
  }
}`}
        />
      </EndpointCard>
      <EndpointCard method="PATCH"  path="/api/notes"      description="Update an existing note (title, content, status, shareToken).">
        <ParamTable
          title="Query parameters"
          rows={[{ name: "id", type: "string", required: true, description: "Note document ID." }]}
        />
      </EndpointCard>
      <EndpointCard method="DELETE" path="/api/notes"      description="Delete a note permanently.">
        <ParamTable
          title="Query parameters"
          rows={[{ name: "id", type: "string", required: true, description: "Note document ID." }]}
        />
      </EndpointCard>

      <SectionHeading id="countdowns">Countdowns</SectionHeading>
      <P>
        Countdowns are stored in Firestore (
        <code style={{ fontFamily: "var(--font-geist-mono, monospace)", color: "#a78bfa" }}>countdowns_v1</code>
        ) and rendered as a dashboard widget.
      </P>
      <EndpointCard method="GET"    path="/api/countdowns" description="List all countdowns for the current user." />
      <EndpointCard method="POST"   path="/api/countdowns" description="Create a countdown.">
        <ParamTable
          title="JSON body"
          rows={[
            { name: "title",       type: "string",  required: true,  description: "Countdown label. Max 80 chars." },
            { name: "targetDate",  type: "number",  required: true,  description: "Unix milliseconds timestamp of target date." },
            { name: "description", type: "string",  required: false, description: "Optional description." },
            { name: "category",    type: "string",  required: false, description: '"exam" | "vacation" | "deadline" | "event" | "custom"' },
            { name: "theme",       type: "string",  required: false, description: '"violet" | "blue" | "green" | "rose" | "amber" | "slate"' },
            { name: "emoji",       type: "string",  required: false, description: "Single emoji. Max 4 chars. Defaults to â³." },
            { name: "pinned",      type: "boolean", required: false, description: "Pin to top of list." },
          ]}
        />
      </EndpointCard>
      <EndpointCard method="PATCH"  path="/api/countdowns" description="Update a countdown (any field).">
        <ParamTable
          title="Query parameters"
          rows={[{ name: "id", type: "string", required: true, description: "Countdown document ID." }]}
        />
      </EndpointCard>
      <EndpointCard method="DELETE" path="/api/countdowns" description="Delete a countdown.">
        <ParamTable
          title="Query parameters"
          rows={[{ name: "id", type: "string", required: true, description: "Countdown document ID." }]}
        />
      </EndpointCard>

      {/* - */}
      {/*  PEOPLE                                               */}
      {/* - */}
      <SectionHeading id="people-class">GET /api/people/class</SectionHeading>
      <P>
        Scrapes the SchoolSoft class list HTML page and returns structured student data. Includes name and
        optional contact info where available.
      </P>
      <EndpointCard
        method="GET"
        path="/api/people/class"
        description="Returns the full class list for the authenticated student's school, scraped from SchoolSoft HTML."
      >
        <CodeBlock
          language="json"
          code={`{
  "success": true,
  "students": [
    { "firstName": "Anna", "lastName": "Lindqvist", "class": "NA1a" }
  ]
}`}
        />
      </EndpointCard>

      <SectionHeading id="people-staff">GET /api/people/staff</SectionHeading>
      <EndpointCard
        method="GET"
        path="/api/people/staff"
        description="Returns the staff directory for the school, scraped from SchoolSoft HTML."
      >
        <CodeBlock
          language="json"
          code={`{
  "success": true,
  "staff": [
    { "firstName": "Erik", "lastName": "Svensson", "title": "Mathematics Teacher" }
  ]
}`}
        />
      </EndpointCard>

      <SectionHeading id="users-search">GET /api/users/search</SectionHeading>
      <P>
        Searches all SchoolSoft+ users by display name or username (Firestore query, min 2 chars).
        Excludes the current user from results.
      </P>
      <EndpointCard
        method="GET"
        path="/api/users/search"
        description="Search for SchoolSoft+ users by name or username. Returns up to 20 results."
      >
        <ParamTable
          title="Query parameters"
          rows={[{ name: "q", type: "string", required: true, description: "Search query. Minimum 2 characters." }]}
        />
        <CodeBlock
          language="json"
          code={`{
  "success": true,
  "users": [
    {
      "username":    "kalle.persson",
      "displayName": "Kalle Persson",
      "pfpUrl":      "...",
      "schoolName":  "Engelska"
    }
  ]
}`}
        />
      </EndpointCard>

      {/* - */}
      {/*  MISC                                                 */}
      {/* - */}
      <SectionHeading id="stats">GET /api/stats</SectionHeading>
      <P>
        Returns anonymous aggregate usage statistics from the{" "}
        <code style={{ fontFamily: "var(--font-geist-mono, monospace)", color: "#a78bfa" }}>stats</code> Firestore
        collection. No authentication required.
      </P>
      <EndpointCard method="GET" path="/api/stats" description="Returns public aggregate stats for the SchoolSoft+ platform." auth={false}>
        <CodeBlock
          language="json"
          code={`{
  "success":               true,
  "totalLogins":           14820,
  "uniqueLogins":          312,
  "failedLogins":          543,
  "totalApiCalls":         98220,
  "totalMessagesSent":     7641,
  "totalConversations":    398,
  "totalAiMessages":       2104,
  "totalNotesCreated":     881,
  "totalScheduleViews":    5230,
  "totalLunchFetches":     3110,
  "totalNewsFetches":      4002,
  "loginHours":  { "8": 210, "9": 340, "12": 188 },
  "loginDays":   { "Monday": 2100, "Tuesday": 1880 },
  "schools":     { "engelska": 8200, "nyvang": 1240 },
  "peakDates":   { "2025-01-13": 490 }
}`}
        />
      </EndpointCard>

      <SectionHeading id="version">GET /api/version</SectionHeading>
      <EndpointCard method="GET" path="/api/version" description="Returns the current SSP+ application version." auth={false}>
        <CodeBlock language="json" code={`{ "version": "1.4.4" }`} />
      </EndpointCard>
    </DocLayout>
  );
}

