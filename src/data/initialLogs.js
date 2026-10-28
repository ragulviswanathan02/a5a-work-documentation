export const INITIAL_LOGS = [
  {
    id: "log-1",
    date: "2026-10-28",
    title: "VakilDesk Payment Webhook & Order Verification Flow",
    project: "VakilDesk",
    category: "Feature Development",
    hours: 4.5,
    status: "Completed",
    description: "• Implemented secure HMAC signature validation for incoming payment webhooks.\n• Integrated automated transaction status sync with the client database.\n• Added retry queue handling with exponential backoff for transient network issues.\n• Created comprehensive unit test suite covering success, signature mismatch, and duplicate event cases.",
    blockers: "",
    links: [
      { label: "PR #142", url: "https://github.com/ragulviswanathan02/vakildesk-app/pull/142" },
      { label: "Jira VAK-389", url: "https://jira.company.com/browse/VAK-389" }
    ]
  },
  {
    id: "log-2",
    date: "2026-10-28",
    title: "Sprint Planning & Architecture Review Sync",
    project: "Internal / Agile",
    category: "Meeting & Planning",
    hours: 1.5,
    status: "Completed",
    description: "• Participated in bi-weekly sprint planning and story point estimation for Sprint 24.\n• Discussed database migration strategies for upcoming multi-tenant schema refactoring.\n• Clarified candidate reporting requirements with product manager.",
    blockers: "",
    links: []
  },
  {
    id: "log-3",
    date: "2026-10-28",
    title: "Candidate Report PDF Generator Memory Optimization",
    project: "A5A Assessment",
    category: "Bug Fixing",
    hours: 2.0,
    status: "In Progress",
    description: "• Investigated Node.js server heap exhaustion during concurrent batch PDF generation.\n• Refactored Puppeteer worker pool to recycle browser instances after every 15 renders.\n• Benchmarked memory reduction: dropped peak usage from 1.4GB to ~380MB.",
    blockers: "Waiting on staging environment deployment to test high-volume stress tests.",
    links: [
      { label: "Commit b89ec12", url: "https://github.com/ragulviswanathan02/a5-assessment/commit/b89ec12" }
    ]
  },
  {
    id: "log-4",
    date: "2026-10-27",
    title: "Candidate Scoring Matrix & Assessment Engine Logic",
    project: "A5A Assessment",
    category: "Feature Development",
    hours: 5.0,
    status: "Completed",
    description: "• Built the weighted scoring calculation algorithm based on category rubrics.\n• Implemented real-time percentile ranking calculations against cohort distributions.\n• Added detailed error boundary handling for missing evaluation data points.",
    blockers: "",
    links: [
      { label: "PR #89", url: "https://github.com/ragulviswanathan02/a5-assessment/pull/89" }
    ]
  },
  {
    id: "log-5",
    date: "2026-10-27",
    title: "Code Review & Security Audit for Authentication Service",
    project: "VakilDesk",
    category: "Code Review & Testing",
    hours: 2.5,
    status: "Completed",
    description: "• Conducted peer code review on JWT refresh token rotation pull request.\n• Identified edge case where invalidated tokens could linger in redis cache.\n• Suggested and verified fix with automated integration tests.",
    blockers: "",
    links: [
      { label: "PR Review #139", url: "https://github.com/ragulviswanathan02/vakildesk-app/pull/139" }
    ]
  },
  {
    id: "log-6",
    date: "2026-10-26",
    title: "Vercel CI/CD Build Pipeline Configuration & Preview URLs",
    project: "DevOps & Tooling",
    category: "Deployment / Ops",
    hours: 3.5,
    status: "Completed",
    description: "• Configured automatic staging branch deployments on Vercel with preview subdomains.\n• Set up encrypted environment variables for test, staging, and production tiers.\n• Added Lighthouse performance check step to GitHub Actions workflow.",
    blockers: "",
    links: [
      { label: "Workflow Config", url: "https://github.com/ragulviswanathan02/a5-assessment/actions" }
    ]
  },
  {
    id: "log-7",
    date: "2026-10-26",
    title: "User Profile Settings Modal & Avatar Cropper",
    project: "VakilDesk",
    category: "Feature Development",
    hours: 4.0,
    status: "Completed",
    description: "• Designed and coded the client-side avatar image crop & compress utility.\n• Hooked up direct S3 presigned URL upload endpoint to avoid piping large binaries through API gateway.\n• Added responsive mobile layout support and accessibility tags.",
    blockers: "",
    links: [
      { label: "PR #136", url: "https://github.com/ragulviswanathan02/vakildesk-app/pull/136" }
    ]
  },
  {
    id: "log-8",
    date: "2026-10-24",
    title: "Database Query Indexing & Response Latency Tuning",
    project: "A5A Assessment",
    category: "Performance Tuning",
    hours: 3.0,
    status: "Completed",
    description: "• Analyzed slow query logs for candidate search endpoint under 5,000+ records.\n• Added composite B-Tree indexes on `(org_id, status, created_at)`.\n• Reduced P95 query response time from 780ms down to 42ms.",
    blockers: "",
    links: [
      { label: "Audit Doc", url: "#" }
    ]
  }
];

export const CATEGORIES = [
  "Feature Development",
  "Bug Fixing",
  "Code Review & Testing",
  "Meeting & Planning",
  "Deployment / Ops",
  "Research & Docs",
  "Performance Tuning"
];

export const STATUS_OPTIONS = [
  { value: "Completed", label: "Completed", color: "#10b981", bg: "rgba(16, 185, 129, 0.12)", border: "rgba(16, 185, 129, 0.3)" },
  { value: "In Progress", label: "In Progress", color: "#3b82f6", bg: "rgba(59, 130, 246, 0.12)", border: "rgba(59, 130, 246, 0.3)" },
  { value: "Under Review", label: "Under Review", color: "#8b5cf6", bg: "rgba(139, 92, 246, 0.12)", border: "rgba(139, 92, 246, 0.3)" },
  { value: "Blocked", label: "Blocked", color: "#ef4444", bg: "rgba(239, 68, 68, 0.12)", border: "rgba(239, 68, 68, 0.3)" }
];
