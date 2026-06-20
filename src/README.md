# 📡 Moeen Cloud Integration & Frontend Architecture

This document serves as the technical reference for the frontend architecture of the **Mo'een Digital Platform**. It explains how the UI securely interacts with the **Moeen Cloud Engine** via our proprietary adapter system.

---

## 🏗️ The Adapter Pattern (Decoupled Architecture)

To maintain maximum security, scalability, and vendor independence, the React frontend **never** communicates with the database directly.

All data flows through a strict pipeline:

```
React Components
    ➡️ Domain Services (e.g., BeneficiaryService)
    ➡️ coreClient.js
    ➡️ MoeenCloudAdapter.js
    ➡️ Moeen Cloud Engine API
```

### Why this architecture?

1. **Security:** Abstracts all backend routing and security tokens from the UI components.
2. **Performance Optimization:** Allows us to inject caching layers before hitting the cloud endpoint.
3. **White-labeling:** Maintains a clean, proprietary codebase independent of third-party SDK lock-ins.

---

## 🔌 API Client (`src/api/coreClient.js`)

All network requests must utilize the unified `coreApi` instance.
**Do not import generic fetch or Axios directly into UI components.**

```javascript
import { coreApi } from '@/api/coreClient';

// Example: Fetching a marketing kit securely
const response = await coreApi.functions.invoke('generateMarketingKit', {
  beneficiaryId: "12345"
});
```

---

## 💾 Caching & Cost Optimization Strategy

The platform is designed to handle thousands of records (e.g., 3000+ beneficiaries across 3+ core NGOs) without generating high cloud billing or latency.

This is managed in `src/lib/query-client.js` using **TanStack Query**:

| Config Key | Value | Purpose |
|------------|-------|---------|
| `staleTime` | 5 minutes (300,000ms) | Data served from memory — no redundant API calls |
| `gcTime` | 10 minutes (600,000ms) | Inactive data retained before garbage collection |

> ⚠️ **Note for future developers:** Do not decrease these times unless absolutely necessary for real-time critical features, as it will exponentially increase API workload.

---

## 🔐 Authentication & Roles

The `AuthContext` communicates entirely through the `MoeenCloudAdapter`.

Frontend role validation (using the `<Can>` component) is strictly cosmetic for UI/UX purposes.

> **Actual data isolation (Tenant Scoping & PDO rules) is strictly enforced server-side by the Moeen Cloud Engine.**

### Role Map

| Role Constant | Display Name | Key Capability |
|--------------|-------------|----------------|
| `super_admin` | Super Admin | Full tenant management |
| `ngo_manager` | NGO Manager | Organization-scoped operations |
| `researcher` | Researcher | Creator-scoped case submission |
| `marketer` | Marketer | AI marketing kit access |
| `pdo` | Privacy Data Officer | Full audit & deletion rights |

---

## 🛠️ Development Environment

This platform was engineered using a fully local, security-hardened development setup:

- **Editor:** VS Code with Dev Containers & workspace extensions
- **AI-Assisted Engineering:** Antigravity CLI (local LLM bridge)
- **Version Control:** Git with conventional commits
- **Linting & Formatting:** ESLint + Prettier (RTL-aware config)
- **Build Tool:** Vite 5 with chunked output optimization

---

## 📦 Key Dependencies

```json
{
  "react": "^18.3.0",
  "react-router-dom": "^6.x",
  "@tanstack/react-query": "^5.x",
  "tailwindcss": "^3.x",
  "framer-motion": "^11.x",
  "@radix-ui/react-*": "latest",
  "recharts": "^2.x",
  "react-hook-form": "^7.x",
  "zod": "^3.x"
}
```

---

*Internal Technical Document — Moeen Digital & Commercials Foundation*
*Last Updated: June 2026 | Authored by: Eng. Mohamed Munibari*
