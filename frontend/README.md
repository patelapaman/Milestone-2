# INFOSYS SPRINGBOARD 7.0 — AI-Assisted Threat Detection Dashboard (Frontend)


## Folder structure
```
threat-dashboard-frontend/
├─ index.html
├─ package.json
├─ vite.config.js
├─ .gitignore
├─ src/
│  ├─ main.jsx                  # React entry point, mounts <App/>
│  ├─ App.jsx                   # Route table (login, dashboard, 404)
│  ├─ context/
│  │  └─ AuthContext.jsx        # Auth state (login/logout, persisted in localStorage)
│  ├─ routes/
│  │  └─ ProtectedRoute.jsx     # Guards /dashboard/* from logged-out users
│  ├─ services/
│  │  └─ api.js                 # API client stub — Member 7 expands this
│  ├─ pages/
│  │  ├─ Login.jsx / .css       # Login page
│  │  ├─ Dashboard.jsx / .css   # Dashboard page (demo content + placeholders)
│  │  └─ NotFound.jsx           # 404 fallback
│  ├─ components/
│  │  └─ layout/
│  │     ├─ Sidebar.jsx / .css
│  │     ├─ Navbar.jsx / .css
│  │     └─ DashboardLayout.jsx / .css
│  └─ styles/
│     └─ theme.css              # Global design tokens (colors, fonts, resets)
```

## Getting started
```bash
npm install
npm run dev
```
Open the printed local URL (defaults to `http://localhost:5173`).

- Visiting `/` redirects to `/login`.
- **Login is a demo**: any email + a password of 4 or more characters signs
  you in (see `src/services/api.js` → `loginRequest`). Member 7 should
  replace this with a real call to the backend auth endpoint.
- After login you land on `/dashboard`, protected by `ProtectedRoute`.

## Build for production
```bash
npm run build
npm run preview   # serves the production build locally
```

## Pushing to GitHub
```bash
git init                     # if not already a repo
git add .
git commit -m "chore: project setup, routing, login page, dashboard layout"
git remote add origin <your-repo-url>
git push -u origin main
```

## Handoff notes for the rest of the team
`Dashboard.jsx` contains clearly labeled placeholder sections — swap these
for the real components as each module is ready:

| Section                 | Owner    | Replace with                                     |
|--------------------------|----------|---------------------------------------------------|
| `.filters-placeholder`   | Member 6 | Severity / Date / Event type / IP filters          |
| `.kpi-grid` contents     | Member 3 | KPI cards wired to `GET /stats`                    |
| `.charts-grid` contents  | Member 5 | Pie / Line / Bar charts                            |
| `.table-placeholder`     | Member 4 | Security events table (search, sort, pagination)   |
| `src/services/api.js`    | Member 7 | Full API client for all endpoints + loading/error  |

To add a new authenticated page (e.g. Security Events), follow the pattern
in `Dashboard.jsx`:
```jsx
import DashboardLayout from "../components/layout/DashboardLayout";

export default function Events() {
  return (
    <DashboardLayout pageTitle="Security Events">
      {/* Member 4's table goes here */}
    </DashboardLayout>
  );
}
```
Then register it in `App.jsx` under a new `<Route>`, wrapped in
`<ProtectedRoute>`.

## Design notes
- Dark navy theme (`--bg-deep`, `--bg-panel` in `theme.css`) — easier on
  analysts' eyes during long monitoring shifts, consistent with real SOC
  tooling.
- Severity colors are semantic and reused everywhere: cyan = live/info,
  green = safe, amber = high, violet = medium, red = critical.
- Sidebar collapses to icon-only on desktop and becomes a slide-in drawer
  under 900px width — fully responsive down to mobile.
- The Login page reuses the same theme tokens and severity-brand color, so
  it feels like the front door of the same product rather than a bolted-on
  screen.
