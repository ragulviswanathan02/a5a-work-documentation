export const INITIAL_LOGS = [];

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
