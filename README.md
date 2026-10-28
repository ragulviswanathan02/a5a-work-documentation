# A5A WorkLog & Documentation Tracker

A sleek, modern engineering work documentation and daily activity tracker built for developers. Log your daily work date-wise, record tasks, hours, project tags, deliverables, and export reports for your team and managers.

![Work Documentation Dashboard](preview.png)

---

## ✨ Features

- **Date-Wise Work Logging**: Grouped chronologically with daily hours sum, relative date badges (Today, Yesterday), and status pills.
- **Key Fields Tracked**:
  - **Date**: Exact date of work
  - **Task / Headline**: Concise summary of what you did
  - **Project / Module**: Categorize across projects (e.g. `A5A Assessment`, `VakilDesk`, `DevOps`)
  - **Category**: Feature Development, Bug Fixing, Code Review, Meetings, etc.
  - **Hours**: Accurate time tracking with 0.25h increments
  - **Status**: Completed, In Progress, Under Review, Blocked
  - **Description**: Detailed multi-line bullet points of accomplishments
  - **Blockers & Dependencies**: Flag issues that need attention
  - **Deliverable Links**: Clickable PR links, commit hashes, or Jira tickets
- **Interactive Views**: Switch between a visual **Timeline** view and a compact **Table** view.
- **Standup Generator**: 1-click generation of formatted Slack/Teams daily standups or weekly summaries.
- **PDF & Print Ready**: Custom `@media print` layout tailored for manager submissions or weekly timesheets.
- **Data Portability**:
  - Auto-saved to `localStorage`
  - **Export JSON**: Download clean `work-logs.json` to commit to Git
  - **Import JSON**: Restore or transfer logs between machines
- **Aesthetic**: Premium dark & light modes, glassmorphism, responsive UI.

---

## 🚀 How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start the local dev server
npm run dev
```

---

## 📦 How to Push to GitHub

1. Open your terminal in this project directory:
   ```bash
   git init
   git add .
   git commit -m "feat: initial release of A5A Work Documentation tracker"
   ```

2. Create a new repository on your GitHub account ([github.com/new](https://github.com/new)) named:
   `a5a-work-documentation`

3. Link the remote and push:
   ```bash
   git branch -M main
   git remote add origin https://github.com/ragulviswanathan02/a5a-work-documentation.git
   git push -u origin main
   ```

---

## ⚡ How to Deploy on Vercel

Since you already use Vercel:
1. Go to your [Vercel Dashboard](https://vercel.com/raguls-projects-ee80d7e9).
2. Click **"Add New..."** -> **"Project"**.
3. Import your `a5a-work-documentation` repository from GitHub.
4. Keep the default settings (Framework Preset: **Vite**, Build Command: `npm run build`, Output Directory: `dist`).
5. Click **Deploy**!
   Your site will be live on `https://a5a-work-documentation.vercel.app` (or similar).

---

## 💡 Daily Workflow Tip

- Use the app throughout your work week to log tasks as you finish them.
- At the end of the day or sprint, click **Export** to save the updated JSON into `src/data/initialLogs.js` (or keep it in local storage).
- Push to GitHub whenever you want Vercel to reflect the latest state!
