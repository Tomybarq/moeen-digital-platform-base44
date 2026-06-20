# منصة مُعين — Source Code Overview

> Internal developer documentation for the Mo'een Digital Platform source tree.

---

## Quick Start

```bash
npm install
npm run dev
```

Access the app at the URL shown in your terminal. A developer-only Technical
Overview page is available at `/dev/overview` (development mode only).

---

## Source Tree

```
src/
├── api/
│   ├── coreClient.js          # Central API gateway — all SDK calls routed here
│   └── base44Client.js        # Compatibility bridge (do not import directly)
├── adapters/
│   └── MoeenCloudAdapter.js   # Single backend swap-point
├── pages/                     # Route-level page components (one per route)
├── components/                # Reusable UI components (domain-grouped)
│   ├── ui/                    # shadcn/ui primitives
│   ├── layout/                # AppLayout, Sidebar, TopBar, NotificationCenter
│   ├── dashboard/             # KPI cards, charts, widgets
│   ├── beneficiaries/         # Beneficiary cards, forms, filters
│   ├── marketers/             # Marketer cards, forms
│   ├── ngos/                  # NGO cards, forms
│   ├── researcher/            # Case wizard, case list
│   ├── reports/               # Report templates, filters, previews
│   ├── settings/              # Platform settings tabs
│   ├── audit/                 # Audit log table, filters
│   ├── shared/                # EmptyState, PaginationBar, ImportDialog, etc.
│   └── auth/                  # RoleBadge, RoleGuard, Can, etc.
├── services/                  # Domain service layer
│   ├── apiService.js          # Centralized data-access orchestrator
│   ├── NGOService.js
│   ├── BeneficiaryService.js
│   ├── MarketerService.js
│   ├── UserService.js
│   ├── DashboardStatsService.js
│   ├── AuditLogService.js
│   └── baseService.js
├── context/                   # React contexts
│   ├── TenantContext.jsx       # Multi-tenant switching
│   └── MotionContext.jsx       # Global motion/animation preferences
├── hooks/                     # Custom React hooks
├── lib/                       # Shared utilities
│   ├── AuthContext.jsx         # Auth state & user profile (platform-managed)
│   ├── rbac.js                 # Role-based access control helpers
│   ├── roles.config.js         # Role definitions
│   ├── validation.js           # Zod schemas
│   ├── query-client.js         # TanStack Query configuration
│   ├── errorLogger.js          # Client-side error tracking
│   └── utils.js                # General utilities
├── config.js                   # Platform configuration
└── types/                      # JSDoc type definitions

functions/                     # Edge functions (Moeen Cloud Engine)
entities/                      # Declarative data schemas + RLS policies
```

---

## Data Flow

```
Page / Component
       │
       ▼
Domain Service (e.g., NGOService.js)
       │
       ▼
apiService.js  ←  Central orchestrator
       │
       ▼
MoeenCloudAdapter.js  ←  Single swap-point
       │
       ▼
coreClient API  ←  All external calls routed here
       │
       ▼
Moeen Cloud Engine (REST + SSE)
```

- **Frontend never imports platform SDKs directly.** Always use `coreApi` from
  `@/api/coreClient`.
- To swap backends, replace only `MoeenCloudAdapter.js`. Zero frontend changes.

---

## Key Conventions

- **Entity data is always flat.** Access `record.field`, never `record.data.field`.
- **All API calls go through `apiService.js`.** Pages and components never call
  `coreApi` directly.
- **RLS is server-enforced.** Frontend permission checks (via `<Can>`, `<RoleGuard>`)
  are cosmetic only.
- **Arabic-first RTL.** All UI text is in Arabic. The `dir="rtl"` attribute is
  set on `<html>` in `index.css`.

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 — Vite — Antigravity CLI |
| Styling | Tailwind CSS — shadcn/ui (Radix primitives) |
| State | TanStack Query — Zod |
| Animation | Framer Motion |
| Charts | Recharts |
| Backend | Moeen Cloud Engine (Proprietary RESTful API) |
| Edge Runtime | Deno |
| Dev Tools | VS Code |

---

> **Internal Documentation — Moeen Digital & Commercials Foundation**
> **Technology & Development Department**