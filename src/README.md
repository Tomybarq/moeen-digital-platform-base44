# منصة مُعين — Mo'een Digital Platform

A role-based digital platform for Saudi non-profit organizations (NGOs) to register,
manage, and support beneficiary cases — built with React, Tailwind CSS, and a
fully decoupled data-service layer ready for any backend.

**Built by [Mohamed Munibari](https://tomybarq.com) / Tomybarq**

---

## ✨ Features

- **Beneficiary case management** — full registration wizard, documents, financial assessment
- **NGO onboarding & management** — organizations, marketers, researchers
- **Role-based dashboards** — KPIs, growth charts, priority distribution, live activity feed
- **Strict form validation** — Zod schemas with Arabic error messages (Saudi phone / national ID formats)
- **RTL-first design** — Arabic typography (Tajawal / IBM Plex Sans Arabic), dark mode, glassmorphism UI

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server
npm run dev
```

> **Dev-only:** a Technical Overview page for engineers is available at `/dev/overview`
> (rendered only in development mode).

## 👥 The 5 User Roles (RBAC)

| Role | Key | Access |
|------|-----|--------|
| مدير المنصة | `platform_admin` | Full access to all data and settings |
| مدير منظمة | `ngo_manager` | Manage his NGO's beneficiaries, marketers, and reports |
| باحث ميداني | `researcher` | Register and edit the cases he created |
| مسوّق | `marketer` | View his NGO's shareable cases for campaigns |
| مسؤول حماية البيانات | `pdo` | Read-only audit and compliance access |

### RBAC Architecture

```
                   Backend (source of truth)
                   ┌─────────────────────────────┐
                   │  Base44 Entity RLS Rules     │
                   │  (per-entity CRUD policies)   │
                   │  getUserPermissions function  │
                   └──────────────┬──────────────┘
                                  │ /me + permissions
                   ┌──────────────▼──────────────┐
                   │  AuthContext (caches perms)  │
                   │  lib/roles.config.js (defs)  │
                   │  lib/rbac.js (helpers)       │
                   └──────────────┬──────────────┘
                                  │
                   ┌──────────────▼──────────────┐
                   │  Frontend UI (cosmetic only) │
                   │  <Can permission="...">      │
                   │  <RoleBadge role={...} />    │
                   │  Sidebar.filter(roles)        │
                   └─────────────────────────────┘
```

**Key principles:**

1. **Backend is the single source of truth.** All data protection is enforced
   server-side via Base44 entity RLS rules (per-entity create/read/update/delete policies).
   The `getUserPermissions` backend function returns the computed permission set for a
   user based on their role.

2. **Frontend checks are cosmetic only.** `Can`, `RoleGuard`, `hasPermission`, and
   `hasRole` exist purely to hide/show UI elements for a better user experience.
   They never make security decisions — the backend always has the final say.

3. **Centralised configuration.** All role definitions, permission matrices, labels,
   colours, and icons live in `src/lib/roles.config.js`. Every component imports from
   this single file. Adding a new role or permission requires changes here only.

4. **Permissions are cached once.** The frontend calls `getUserPermissions` once at
   login and caches the result. Permissions are NOT included in every API response —
   only the `/me` equivalent returns them.

### Permission Matrix

| Permission | Admin | NGO Mgr | Researcher | Marketer | PDO |
|-----------|:-----:|:-------:|:----------:|:--------:|:---:|
| `dashboard:view` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `ngos:view` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `ngos:create/edit/delete` | ✓ | — | — | — | — |
| `beneficiaries:view` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `beneficiaries:create` | ✓ | — | ✓ | — | — |
| `beneficiaries:edit` | ✓ | — | ✓ | — | — |
| `beneficiaries:delete` | ✓ | — | — | — | ✓ |
| `beneficiaries:export` | ✓ | ✓ | — | — | ✓ |
| `beneficiaries:import` | ✓ | — | ✓ | — | — |
| `beneficiaries:archive` | ✓ | — | ✓ | — | — |
| `marketers:view` | ✓ | ✓ | — | ✓ | — |
| `marketers:create/edit/delete` | ✓ | — | — | — | — |
| `users:view/create/edit/delete` | ✓ | — | — | — | — |
| `settings:view` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `settings:edit` | ✓ | — | — | — | — |
| `marketing:view` | ✓ | ✓ | — | ✓ | — |
| `researcher_workspace:view` | ✓ | — | ✓ | — | — |

### Data Isolation (RLS)

The backend enforces three tiers of data isolation server-side:

| Role | Sees |
|------|------|
| `platform_admin`, `pdo` | All records across all NGOs |
| `ngo_manager`, `marketer` | Only records belonging to their NGO |
| `researcher` | Only records they created (`created_by_id`) |

### 403 Forbidden Page

When a user attempts to access a restricted page or perform a forbidden action,
the backend returns `403 Forbidden`. The frontend displays a user-friendly
page at `/forbidden` with:
- Clear Arabic message: "غير مصرح لك بالوصول إلى هذه الصفحة"
- "تواصل مع الدعم الفني" button → `mailto:tech@ghazara.net`
- "العودة إلى لوحة التحكم" secondary action

### Roles Configuration

- **Central config:** `src/lib/roles.config.js` — THE single source of truth
- **Runtime helpers:** `src/lib/rbac.js` — imports from roles.config.js
- **UI guards:** `src/components/auth/Can.jsx`, `src/components/auth/RoleGuard.jsx`
- **Role display:** `src/components/auth/RoleBadge.jsx`
- **Backend:** `functions/getUserPermissions.js` — computes permissions from role

## 🗂 Project Structure

```
src/
├── pages/          # One file per route (registered in App.jsx)
├── components/     # Reusable components, grouped by domain (auth/, dashboard/, …)
├── services/       # Domain services (NGOService, BeneficiaryService, etc.) + apiService.js
├── adapters/       # Backend adapters — Base44Adapter.js (swap point for Supabase/Firebase/API)
├── config.js       # DATA_PROVIDER setting + simulated latency
├── types/          # JSDoc type definitions
├── hooks/          # Custom React hooks
└── lib/            # rbac.js · schemas.js (Zod) · AuthContext · validation
```

### Data Flow

```
Page / Component → Domain Service → apiService.js → Adapter → Backend SDK
```

- **`apiService.js` is the ONLY file that imports `Base44Adapter`.**
- Domain services (`NGOService`, `BeneficiaryService`, etc.) import from `apiService.js`.
- Only three files touch the SDK: `adapters/Base44Adapter.js`, `services/apiService.js`, and `lib/AuthContext.jsx` (platform-managed).
- **Zero frontend components** (pages, modals, hooks) call the adapter or SDK directly.
- To swap backends, replace only `Base44Adapter.js` with another adapter (e.g. `SupabaseAdapter`) — the entire platform stays identical.

## 🔌 Architecture — Backend-Agnostic Data Layer

All UI data access flows through `src/services/` → `src/adapters/` → backend.
To swap backends, replace only the adapter — services and pages stay untouched.

```
Page → Service → Adapter → Backend
```

- `src/config.js` — set `DATA_PROVIDER` (`base44` | `supabase` | `firebase` | `api`)
- `src/adapters/` — one adapter per backend provider
- `src/services/` — domain services (NGOService, BeneficiaryService, etc.)

**Validation:** frontend rules in `src/lib/schemas.js` (Saudi phone `^05\d{8}$`,
national ID `^[12]\d{9}$`) — mirror them server-side.

**Access control:** per-NGO data isolation and role permissions
(`src/lib/rbac.js`) should be re-implemented server-side; the frontend checks are UX-only.

## 🔍 Audit Logs — Immutable Activity Tracking

Every critical action on the platform is recorded immutably with full context.
The audit trail supports compliance with SDAIA and PDPL regulatory requirements.

### Event Types

| Event | Description |
|-------|-------------|
| `CREATE` | Record creation (NGO, Beneficiary, Marketer, User) |
| `UPDATE` | Record modification |
| `DELETE` | Record deletion |
| `BULK_IMPORT` | Bulk CSV/Excel import operations |
| `BULK_EXPORT` | Data export (CSV/PDF) |
| `LOGIN_SUCCESS` | Successful login |
| `LOGIN_FAILURE` | Failed login attempt |
| `ROLE_CHANGE` | User role modification |
| `PERMISSION_CHANGE` | Permission changes |
| `ARCHIVE` | Record archival |
| `UNARCHIVE` | Record unarchival |

### Data Structure

Each audit log entry contains:
- `event_type` — Type of event
- `user_id` — ID of the acting user
- `user_role` — Role of the user at event time
- `resource_type` — Affected resource (NGO, Beneficiary, Marketer, User, Platform, Auth)
- `resource_id` — Affected resource ID
- `resource_label` — Human-readable resource name
- `associationId` — NGO ID for data isolation
- `timestamp` — ISO 8601 with milliseconds (auto-generated)
- `details` — JSON object with change context (sensitive data redacted)
- `ip_address` — Client IP (optional)
- `user_agent` — Client browser/device (optional)

### Immutability

- **Audit log entries are immutable** — enforced at the database level via RLS.
- `UPDATE` and `DELETE` operations are disabled for all roles.
- Once written, a log entry can never be modified or removed.

### Data Isolation

Logs are scoped by `associationId` (NGO ID):

| Role | Sees |
|------|------|
| `platform_admin`, `pdo` | All logs across all NGOs |
| `ngo_manager`, `marketer` | Only logs from their own NGO |
| `researcher` | Only their own activity logs |

### Sensitive Data Protection

- Raw personal data (national ID, phone, email, password) is **never** stored in `details`.
- Instead, metadata like `{ action: "updated_national_id" }` is logged.
- The `sanitiseDetails` function strips sensitive fields before write.

### Search & Filtering

The audit log page (`/audit-logs`) provides:
- Filter by event type, resource type
- Free-text search across user IDs and resource labels
- Pagination (50 records per page)
- Click-to-view detail dialog with full JSON context

### Export

- **CSV** and **PDF** export supported
- **Preview before export** — modal showing first 15 records with column selection
- Export respects current filters

### Data Retention

- Active logs retained for a **minimum of 6 months**.
- Long-term archival/deletion policy: logs older than 6 months may be archived to cold storage (future enhancement).

### Database Indexes

Entity fields are indexed by Base44. The following query patterns are optimised:
- `(associationId, created_date DESC)` — NGO-scoped chronological views
- `(event_type, created_date DESC)` — Filter by event type
- `(user_id, created_date DESC)` — User-specific activity trails
- `(resource_type, resource_id, created_date DESC)` — Resource-specific change tracking

### Backend Function

`functions/logAudit.js` — single writer for all audit events:
- Called by entity automations on CRUD operations
- Called by frontend for auth/permission/export events
- Validates and sanitises all input before write

### Audit Log Page

Accessible at `/audit-logs` by: Platform Admin, PDO, NGO Manager.

---

## 🛠 Tech Stack

React 18 · Vite · Tailwind CSS · shadcn/ui (Radix) · Framer Motion · Recharts ·
TanStack Query · Zod · React Router v6