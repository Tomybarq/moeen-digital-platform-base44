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

## 🛠 Tech Stack

React 18 · Vite · Tailwind CSS · shadcn/ui (Radix) · Framer Motion · Recharts ·
TanStack Query · Zod · React Router v6