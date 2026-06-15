# منصة مُعين — Mo'een Digital Platform

A role-based digital platform for Saudi non-profit organizations (NGOs) to register,
manage, and support beneficiary cases — built with React, Tailwind CSS, and a
fully decoupled data-service layer ready for any backend.

**Built by [Mohamed Munibari](https://tomybarq.com) / Tomybarq**

---

## 📡 API Reference — Complete RESTful API Documentation

The Mo'een platform exposes a full RESTful API suite for all entities and backend
operations. This document serves as the complete API reference for external integrators,
mobile apps, and third-party services.

---

### 🔐 Authentication & Security

All API endpoints require authentication via JWT (JSON Web Tokens). The platform uses
**OAuth2 Bearer Token** authentication.

#### Auth Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/auth/login` | Login with email & password | None |
| `POST` | `/auth/register` | Register a new account | None |
| `POST` | `/auth/verify-otp` | Verify OTP after registration | None |
| `POST` | `/auth/resend-otp` | Resend OTP code | None |
| `POST` | `/auth/reset-password-request` | Request password reset email | None |
| `POST` | `/auth/reset-password` | Complete password reset with token | None |
| `POST` | `/auth/logout` | Invalidate current session | Bearer |
| `GET`  | `/auth/me` | Get current user profile & permissions | Bearer |
| `PATCH`| `/auth/me` | Update current user profile | Bearer |
| `GET`  | `/auth/oauth/{provider}` | Initiate OAuth login (Google) | None |

#### Request Headers

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
Accept-Language: ar | en
```

#### Rate Limiting

- **Authenticated requests:** 1000 requests per minute
- **Unauthenticated requests:** 60 requests per minute
- **Bulk operations:** 10 requests per minute
- Rate limit headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

#### Error Response Format

All errors follow a consistent structure:

```json
{
  "error": "Human-readable Arabic error message",
  "code": "ERROR_CODE",
  "status": 400,
  "details": {
    "field": "phone",
    "reason": "invalid_format"
  }
}
```

**HTTP Status Codes:**

| Code | Meaning |
|------|---------|
| `200` | Success |
| `201` | Created |
| `400` | Bad Request — invalid input |
| `401` | Unauthorized — missing or invalid token |
| `403` | Forbidden — insufficient permissions |
| `404` | Not Found — resource doesn't exist |
| `409` | Conflict — duplicate resource |
| `422` | Validation Error |
| `429` | Rate Limit Exceeded |
| `500` | Internal Server Error |

---

### 🏢 NGO Entity API

**Base Path:** `/api/entities/NGO`

#### NGO Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✓ | Organization name |
| `responsible_person` | string | ✓ | Responsible person |
| `phone` | string | ✓ | Contact phone |
| `email` | string (email) | ✓ | Contact email |
| `donation_url` | string | | Official donation platform URL |
| `city` | string | | City |
| `category` | enum | | خيرية, تعليمية, صحية, بيئية, اجتماعية, أخرى |
| `status` | enum | | active (default), archived |
| `logo_url` | string | | Logo image URL |
| `notes` | string | | Additional notes |

#### Endpoints

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET` | `/api/entities/NGO` | List all NGOs (paginated) | All |
| `GET` | `/api/entities/NGO?sort=-created_date&limit=50&skip=0` | List with pagination | All |
| `GET` | `/api/entities/NGO?status=active` | Filter by status | All |
| `GET` | `/api/entities/NGO?city=الرياض` | Filter by city | All |
| `GET` | `/api/entities/NGO/{id}` | Get single NGO | All |
| `POST` | `/api/entities/NGO` | Create NGO | platform_admin |
| `PATCH` | `/api/entities/NGO/{id}` | Update NGO | platform_admin, ngo_manager (own) |
| `DELETE` | `/api/entities/NGO/{id}` | Delete NGO | platform_admin |

#### Example: Create NGO

```bash
curl -X POST https://app.base44.com/api/entities/NGO \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "جمعية البر الخيرية",
    "responsible_person": "محمد العتيبي",
    "phone": "0501234567",
    "email": "info@alberr.org.sa",
    "city": "الرياض",
    "category": "خيرية"
  }'
```

#### Example: List NGOs

```bash
curl "https://app.base44.com/api/entities/NGO?status=active&sort=-created_date&limit=20" \
  -H "Authorization: Bearer $TOKEN"
```

#### Response: List

```json
{
  "data": [
    {
      "id": "6a2acef4dbe74042c48129ec",
      "name": "جمعية البر الخيرية بعفراء",
      "responsible_person": "عبدالله الشمري",
      "phone": "0501111111",
      "email": "info@alberr.org.sa",
      "city": "عفراء",
      "category": "خيرية",
      "status": "active",
      "donation_url": "https://donate.example.org",
      "logo_url": null,
      "notes": null,
      "created_date": "2026-01-15T10:30:00Z",
      "updated_date": "2026-03-20T14:00:00Z"
    }
  ],
  "total": 6,
  "skip": 0,
  "limit": 20
}
```

---

### 👥 Beneficiary Entity API

**Base Path:** `/api/entities/Beneficiary`

#### Beneficiary Schema — Core Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `full_name` | string | ✓ | Head of household name |
| `phone` | string | ✓ | Primary mobile |
| `city` | string | ✓ | City |
| `case_type` | enum | ✓ | مادي, صحي, تعليمي, اجتماعي, متعدد |
| `priority` | enum | ✓ | عاجل, مرتفع, متوسط (default), منخفض |
| `national_id` | string | | National ID number |
| `birth_year` | number | | Birth year |
| `age` | number | | Age |
| `gender` | enum | | ذكر, أنثى |
| `phone_alt` | string | | Alternative phone |
| `district` | string | | District |
| `national_address` | string | | National address |
| `social_status` | enum | | أعزب, متزوج, مطلق, أرمل, مهجور |
| `education_level` | string | | Education level |
| `health_status` | enum | | سليم, معاق, مريض |
| `disability` | boolean | | Has disability |
| `disability_type` | string | | Disability type |
| `sickness_type` | string | | Sickness type |
| `status` | enum | | active (default), archived, supported |
| `file_number` | string | | File number |
| `case_status` | enum | | جديد (default), تحديث, خارجي |
| `ngo_id` | string | | Associated NGO ID |
| `ngo_name` | string | | Associated NGO name |
| `researcher_name` | string | | Social researcher name |
| `visit_date` | string (date) | | Field visit date |
| `approved_by` | string | | Approved by manager |
| `notes` | string | | Case notes |
| `documents` | array[string] | | Document/image URLs |

#### Beneficiary Schema — Financial Fields

| Field | Type | Description |
|-------|------|-------------|
| `income_salary` | number | Employment salary |
| `income_social_security` | number | Social security income |
| `income_account_citizen` | number | Citizen account |
| `income_rehab` | number | Rehabilitation support |
| `income_other_ngos` | number | Other NGO support |
| `income_other_sources` | string | Other income sources |
| `total_income` | number | Total income |
| `expense_rent` | number | Rent |
| `expense_electricity` | number | Electricity |
| `expense_water` | number | Water |
| `expense_internet` | number | Internet |
| `expense_medical` | number | Medical treatment |
| `expense_transport` | number | Transportation |
| `expense_food` | number | Food |
| `expense_debt_installment` | number | Debt installments |
| `debt_reason` | string | Debt reason |
| `debt_period` | string | Debt period |
| `total_expenses` | number | Total expenses |
| `net_income` | number | Net income |
| `income_level` | enum | لا يوجد دخل, دخل منخفض, دخل متوسط |

#### Beneficiary Schema — Research Fields

| Field | Type | Description |
|-------|------|-------------|
| `dependents_count` | number | Family member count |
| `dependents_data` | array | Dependent details (name, age, relation, health, education) |
| `environment_type` | enum | هجرة, بادية, قرية, محافظة, مدينة |
| `housing_type` | enum | شعبي, شقة, فيلا, ملحق |
| `housing_tenure` | enum | إيجار, ملك, إرث, وقف |
| `basic_needs` | string | Basic needs (JSON) |
| `non_basic_needs` | string | Non-basic needs (JSON) |
| `researcher_opinion_basic` | string | Researcher opinion — basic data |
| `researcher_opinion_dependents` | string | Researcher opinion — dependents |
| `researcher_opinion_financial` | string | Researcher opinion — financial |
| `researcher_opinion_housing` | string | Researcher opinion — housing |
| `researcher_opinion_needs` | string | Researcher opinion — needs |
| `final_recommendation` | string | Final recommendation |

#### Endpoints

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET` | `/api/entities/Beneficiary` | List beneficiaries (paginated) | All (scoped) |
| `GET` | `/api/entities/Beneficiary?status=active&city=الرياض` | Filter | All (scoped) |
| `GET` | `/api/entities/Beneficiary?priority=عاجل&sort=created_date` | Filter + sort | All (scoped) |
| `GET` | `/api/entities/Beneficiary/{id}` | Get single beneficiary | All (scoped) |
| `POST` | `/api/entities/Beneficiary` | Create beneficiary | platform_admin, researcher |
| `PATCH` | `/api/entities/Beneficiary/{id}` | Update beneficiary | platform_admin, researcher (own), ngo_manager (own ngo) |
| `DELETE` | `/api/entities/Beneficiary/{id}` | Delete beneficiary | platform_admin, pdo |
| `POST` | `/api/entities/Beneficiary/bulk` | Bulk create | platform_admin, researcher |

#### Example: Create Beneficiary

```bash
curl -X POST https://app.base44.com/api/entities/Beneficiary \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "أحمد محمد العنزي",
    "phone": "0501111111",
    "city": "الرياض",
    "case_type": "مادي",
    "priority": "عاجل",
    "gender": "ذكر",
    "birth_year": 1975,
    "income_level": "لا يوجد دخل",
    "total_income": 0,
    "total_expenses": 2500
  }'
```

#### Example: Filter by Multiple Criteria

```bash
curl "https://app.base44.com/api/entities/Beneficiary?city=الرياض&case_type=مادي&priority=عاجل&status=active&sort=-created_date&limit=50" \
  -H "Authorization: Bearer $TOKEN"
```

---

### 📢 Marketer Entity API

**Base Path:** `/api/entities/Marketer`

#### Marketer Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `full_name` | string | ✓ | Full name |
| `phone` | string | ✓ | Mobile number |
| `ngo_name` | string | ✓ | Organization name |
| `email` | string (email) | | Email address |
| `city` | string | | City |
| `ngo_id` | string | | Associated NGO ID |
| `specialization` | enum | | تسويق رقمي, تسويق ميداني, علاقات عامة, إعلام اجتماعي, أخرى |
| `campaigns_count` | number | | Completed campaigns count |
| `status` | enum | | active (default), archived |
| `notes` | string | | Additional notes |

#### Endpoints

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET` | `/api/entities/Marketer` | List marketers | platform_admin, ngo_manager, marketer |
| `GET` | `/api/entities/Marketer?status=active&ngo_id={id}` | Filter | platform_admin, ngo_manager |
| `GET` | `/api/entities/Marketer/{id}` | Get single marketer | platform_admin, ngo_manager, marketer (own) |
| `POST` | `/api/entities/Marketer` | Create marketer | platform_admin, ngo_manager (own ngo) |
| `PATCH` | `/api/entities/Marketer/{id}` | Update marketer | platform_admin, ngo_manager (own ngo), marketer (own) |
| `DELETE` | `/api/entities/Marketer/{id}` | Delete marketer | platform_admin, ngo_manager (own ngo) |

#### Example: Create Marketer

```bash
curl -X POST https://app.base44.com/api/entities/Marketer \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "سارة القحطاني",
    "phone": "0509876543",
    "email": "sara@example.org",
    "ngo_name": "جمعية البر الخيرية",
    "ngo_id": "6a2acef4dbe74042c48129ec",
    "specialization": "تسويق رقمي",
    "city": "الرياض"
  }'
```

---

### 👤 User Entity API

**Base Path:** `/api/entities/User`

#### User Schema

| Field | Type | Description |
|-------|------|-------------|
| `id` | string (auto) | Unique identifier |
| `email` | string | Email address |
| `full_name` | string | Full name |
| `role` | enum | platform_admin, ngo_manager, researcher, marketer, pdo |
| `ngo_id` | string | Associated NGO ID (for ngo_manager/marketer) |
| `ngo_name` | string | Associated NGO name |
| `created_date` | string (auto) | Account creation date |

#### Endpoints

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET` | `/api/entities/User` | List all users | platform_admin |
| `GET` | `/api/entities/User?role=researcher` | Filter by role | platform_admin |
| `GET` | `/api/entities/User/{id}` | Get user | platform_admin, own |
| `PATCH` | `/api/entities/User/{id}` | Update user | platform_admin |
| `PATCH` | `/auth/me` | Update current user | All authenticated |
| `POST` | `/api/users/invite` | Invite new user | platform_admin, admin (admin role), user (user role) |

#### Example: Invite User

```bash
curl -X POST https://app.base44.com/api/users/invite \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "researcher@example.org",
    "role": "researcher"
  }'
```

---

### 📊 Reports API

**Base Path:** `/api/functions/generateReport`

Generate aggregated reports across multiple entity types with filtering and export.

#### Report Types

| Type | Description |
|------|-------------|
| `ngo_performance` | NGO performance — beneficiary counts per NGO, status distribution |
| `beneficiary_distribution` | Beneficiary distribution by city, case type, priority, status, income level, gender |
| `marketing_effectiveness` | Marketing effectiveness — marketer campaigns, reach, linked beneficiaries |
| `platform_activity` | Platform activity — users, audit logs, recent operations |
| `financial_overview` | Financial overview — income, expenses, net income analysis |

#### Request

```http
POST /api/functions/generateReport
Content-Type: application/json
Authorization: Bearer <token>

{
  "report_type": "ngo_performance",
  "filters": {
    "ngo_id": "optional-ngo-id",
    "city": "الرياض",
    "case_type": "مادي",
    "priority": "عاجل",
    "status": "active",
    "date_from": "2026-01-01",
    "date_to": "2026-06-30"
  },
  "format": "json"
}
```

#### Response: JSON Format

```json
{
  "success": true,
  "data": {
    "report_type": "ngo_performance",
    "title": "تقرير أداء المنظمات",
    "summary": {
      "total_ngos": 6,
      "total_beneficiaries": 1250
    },
    "rows": [
      {
        "id": "6a2acef4dbe74042c48129ec",
        "name": "جمعية البر الخيرية",
        "city": "الرياض",
        "category": "خيرية",
        "total": 450,
        "active": 320,
        "archived": 80,
        "supported": 50
      }
    ]
  },
  "csvHeaders": ["المنظمة", "المدينة", "التصنيف", "إجمالي", "نشط", "مؤرشفة", "مدعوم"],
  "csvRows": [["جمعية البر الخيرية", "الرياض", "خيرية", 450, 320, 80, 50]]
}
```

#### Response: CSV Format (format="csv")

Returns `Content-Type: text/csv; charset=utf-8` with BOM for Arabic Excel compatibility.

#### Request: Beneficiary Distribution

```json
{
  "report_type": "beneficiary_distribution",
  "filters": {
    "ngo_id": "6a2acef4dbe74042c48129ec",
    "city": "الرياض"
  },
  "format": "json"
}
```

#### Response: Beneficiary Distribution

```json
{
  "success": true,
  "data": {
    "report_type": "beneficiary_distribution",
    "title": "تقرير توزيع المستفيدين",
    "summary": { "total": 320 },
    "byCity": { "الرياض": 180, "جدة": 90, "الدمام": 50 },
    "byCaseType": { "مادي": 120, "صحي": 80, "تعليمي": 60, "اجتماعي": 40, "متعدد": 20 },
    "byPriority": { "عاجل": 50, "مرتفع": 100, "متوسط": 130, "منخفض": 40 },
    "byStatus": { "active": 250, "archived": 30, "supported": 40 },
    "byIncomeLevel": { "لا يوجد دخل": 80, "دخل منخفض": 160, "دخل متوسط": 80 },
    "byGender": { "ذكر": 190, "أنثى": 130 }
  }
}
```

#### Request: Financial Overview

```json
{
  "report_type": "financial_overview",
  "filters": { "ngo_id": "6a2acef4dbe74042c48129ec" },
  "format": "json"
}
```

#### Response: Financial Overview

```json
{
  "success": true,
  "data": {
    "report_type": "financial_overview",
    "title": "تقرير الوضع المالي للمستفيدين",
    "summary": { "total_beneficiaries": 320 },
    "incomeLevelBreakdown": { "لا يوجد دخل": 80, "دخل منخفض": 160, "دخل متوسط": 80 },
    "incomeStats": { "average": 2850, "total_income": 912000, "count": 320 },
    "expenseStats": { "average": 3400, "total_expenses": 1088000, "count": 320 },
    "netIncomeStats": { "average": -550, "total_net": -176000, "count": 320 }
  }
}
```

---

### 🔔 Notifications API

**Base Path:** `/api/entities/Notification` and `/api/functions/sendNotification`

#### Notification Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `user_id` | string | ✓ | Recipient user ID |
| `type` | enum | ✓ | case_update, task_assigned, message, system_alert, import_complete, status_change, role_change |
| `title` | string | ✓ | Notification title |
| `message` | string | | Detailed message |
| `link` | string | | Associated link |
| `is_read` | boolean | | Read status (default: false) |
| `entity_type` | string | | Associated entity type |
| `entity_id` | string | | Associated entity ID |

#### Endpoints

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET` | `/api/entities/Notification` | List user's notifications | All (own) |
| `GET` | `/api/entities/Notification?is_read=false` | Unread notifications | All (own) |
| `PATCH` | `/api/entities/Notification/{id}` | Mark as read | All (own) |
| `DELETE` | `/api/entities/Notification/{id}` | Delete notification | All (own) |
| `POST` | `/api/functions/sendNotification` | Send notification(s) | All authenticated |

#### Example: Send Notification

```bash
curl -X POST https://app.base44.com/api/functions/sendNotification \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "user_ids": ["user-id-1", "user-id-2"],
    "type": "case_update",
    "title": "تحديث حالة مستفيد",
    "message": "تم تغيير حالة المستفيد من قيد المراجعة إلى نشط",
    "link": "/beneficiaries/detail?id=abc123",
    "entity_type": "Beneficiary",
    "entity_id": "abc123"
  }'
```

#### Response

```json
{
  "success": true,
  "ids": ["notification-id-1", "notification-id-2"],
  "count": 2
}
```

#### Mark All as Read

```http
POST /api/functions/sendNotification
{
  "user_ids": [],
  "type": "system_alert",
  "title": "تم تحديث الحالة",
  "message": "رسالة النظام"
}
```

> When `user_ids` is empty, the notification is sent to the authenticated user.

---

### 📝 Audit Log API

**Base Path:** `/api/entities/AuditLog` and `/api/functions/logAudit`

#### AuditLog Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `event_type` | enum | ✓ | CREATE, UPDATE, DELETE, BULK_IMPORT, BULK_EXPORT, LOGIN_SUCCESS, LOGIN_FAILURE, ROLE_CHANGE, PERMISSION_CHANGE, ARCHIVE, UNARCHIVE |
| `resource_type` | enum | ✓ | NGO, Beneficiary, Marketer, User, Platform, Auth |
| `user_id` | string | | Acting user ID |
| `user_role` | string | | User role at event time |
| `resource_id` | string | | Affected resource ID |
| `resource_label` | string | | Human-readable resource name |
| `associationId` | string | | NGO ID for data isolation |
| `details` | string | | JSON details (sanitized) |
| `ip_address` | string | | Client IP |
| `user_agent` | string | | Browser/device info |

#### Endpoints

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET` | `/api/entities/AuditLog` | List audit logs (paginated) | platform_admin, pdo, ngo_manager |
| `GET` | `/api/entities/AuditLog?event_type=UPDATE&resource_type=Beneficiary` | Filter | platform_admin, pdo, ngo_manager |
| `GET` | `/api/entities/AuditLog/{id}` | Get single log | platform_admin, pdo, ngo_manager |
| `POST` | `/api/functions/logAudit` | Write audit entry | Internal (automations) |

> Audit log entries are **immutable** — update and delete operations are disabled at the database level for all roles.

#### Example: Filter Audit Logs

```bash
curl "https://app.base44.com/api/entities/AuditLog?event_type=UPDATE&resource_type=Beneficiary&sort=-created_date&limit=50" \
  -H "Authorization: Bearer $TOKEN"
```

---

### 🔧 Backend Functions (Custom Endpoints)

All custom backend functions are accessible via the unified endpoint:

```
POST /api/functions/{functionName}
```

| Function | Description | Auth Required | Admin Only |
|----------|-------------|:---:|:---:|
| `generateReport` | Generate aggregated reports | ✓ | |
| `sendNotification` | Create notifications for users | ✓ | |
| `logAudit` | Write audit log entries | ✓ | |
| `getUserPermissions` | Get computed permissions for a user | ✓ | |

#### Function: getUserPermissions

```http
POST /api/functions/getUserPermissions
Authorization: Bearer <token>
Content-Type: application/json

{}
```

**Response:**

```json
{
  "permissions": [
    "dashboard:view",
    "ngos:view",
    "beneficiaries:view",
    "beneficiaries:create",
    "beneficiaries:edit",
    "beneficiaries:import",
    "beneficiaries:archive",
    "settings:view",
    "researcher_workspace:view",
    "reports:view"
  ],
  "role": "researcher"
}
```

---

### 🔌 Real-time Subscriptions (WebSocket/SSE)

The platform supports real-time entity change subscriptions via the SDK:

```javascript
// Subscribe to beneficiary changes
const unsubscribe = base44.entities.Beneficiary.subscribe((event) => {
  // event.type: "create" | "update" | "delete"
  // event.id: entity ID
  // event.data: full entity data
});

// Cleanup
unsubscribe();
```

**Events delivered:**
- `create` — new record with full data
- `update` — updated record with full data
- `delete` — deleted record ID

**Notification subscriptions** also available for real-time notification delivery.

---

### 📤 File Upload API

**Endpoint:** `POST /api/integrations/Core/UploadFile`

Upload files for documents, logos, and attachments.

```bash
curl -X POST https://app.base44.com/api/integrations/Core/UploadFile \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@document.pdf"
```

**Response:**

```json
{
  "file_url": "https://storage.base44.com/files/abc123/document.pdf"
}
```

**Supported formats:** PDF, PNG, JPG, JPEG, CSV, XLSX, JSON, DOC, DOCX
**Max file size:** 25MB

---

### 🤖 LLM Integration API

**Endpoint:** `POST /api/integrations/Core/InvokeLLM`

AI-powered text generation with optional web search context.

```bash
curl -X POST https://app.base44.com/api/integrations/Core/InvokeLLM \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Analyze the following beneficiary data and suggest priority actions",
    "add_context_from_internet": false,
    "response_json_schema": {
      "type": "object",
      "properties": {
        "priority_actions": { "type": "array", "items": { "type": "string" } },
        "risk_level": { "type": "string", "enum": ["low", "medium", "high"] }
      }
    }
  }'
```

---

## 🏗 Architecture — Complete Decoupling

The Mo'een platform follows a **strictly decoupled architecture** where the backend operates as an entirely independent service.

### Controller Layer

```
┌─────────────────────────────────────────────────────────┐
│                   FRONTEND (React SPA)                    │
│  Pages → Domain Services → apiService.js → Adapter       │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTP / SDK
┌──────────────────────────▼──────────────────────────────┐
│                  BACKEND (Base44 Platform)                 │
│                                                          │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │ Entity APIs  │  │  Functions   │  │  Integrations  │  │
│  │ (Auto-CRUD)  │  │  (Custom)    │  │  (Core/Stripe) │  │
│  └──────┬───────┘  └──────┬───────┘  └───────┬────────┘  │
│         │                 │                   │           │
│  ┌──────▼─────────────────▼───────────────────▼────────┐  │
│  │              AUTH LAYER (JWT / OAuth2)              │  │
│  │         Row-Level Security (RLS) Enforcement         │  │
│  └──────────────────────┬──────────────────────────────┘  │
│                         │                                  │
│  ┌──────────────────────▼──────────────────────────────┐  │
│  │              DATA LAYER (Entity Store)               │  │
│  │         Automatic Indexing + Pagination              │  │
│  └─────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

### Decoupling Principles

1. **Frontend never calls the backend directly.** All data access goes through `apiService.js` → `Base44Adapter.js` → SDK.

2. **Adapter is the single swap point.** To migrate to Supabase, Firebase, or a custom REST API, replace only `Base44Adapter.js`. Zero frontend changes needed.

3. **Backend functions are independently deployable.** Each function in `functions/` is a standalone Deno edge handler with its own lifecycle.

4. **Entity schemas drive the API.** Adding a field to an entity JSON schema automatically exposes it in the REST API, SDK, and real-time subscriptions — no manual endpoint wiring.

5. **RLS is server-enforced.** All data isolation rules live in entity JSON schemas as `rls` policies. Frontend permission checks are purely cosmetic.

### Backend Function Structure

Every backend function follows this pattern:

```javascript
import { createClientFromRequest } from "npm:@base44/sdk@0.8.31";

Deno.serve(async (req) => {
  try {
    // 1. Authenticate
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    // 2. Validate input
    const payload = await req.json();

    // 3. Execute business logic
    const result = await base44.asServiceRole.entities.SomeEntity.filter({...});

    // 4. Return response
    return Response.json({ success: true, data: result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
```

---

## 🏢 Multi-Tenant Architecture

The Mo'een platform is fully multi-tenant. Each NGO operates as an independent
**tenant** with complete data isolation, while sharing the same infrastructure.

### Tenant Model

```
┌──────────────────────────────────────────────────────────────┐
│                    SHARED INFRASTRUCTURE                       │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │  NGO #1  │  │  NGO #2  │  │  NGO #3  │  │  NGO #4  │    │
│  │ (Tenant) │  │ (Tenant) │  │ (Tenant) │  │ (Tenant) │    │
│  │          │  │          │  │          │  │          │    │
│  │ مستفيدين │  │ مستفيدين │  │ مستفيدين │  │ مستفيدين │    │
│  │ مسوّقين   │  │ مسوّقين   │  │ مسوّقين   │  │ مسوّقين   │    │
│  │ مستخدمين │  │ مستخدمين │  │ مستخدمين │  │ مستخدمين │    │
│  │ سجل تدقيق│  │ سجل تدقيق│  │ سجل تدقيق│  │ سجل تدقيق│    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
│                                                              │
│              RLS Enforcement Layer (per-row)                   │
│              Single Database — Shared Schema                  │
└──────────────────────────────────────────────────────────────┘
```

### Data Isolation Strategy

The platform uses **Row-Level Security (RLS)** with a shared-database,
shared-schema approach. Every data record carries a tenant identifier:

| Entity | Tenant Column | Isolation Rule |
|--------|:---:|--------|
| `NGO` | `id` (self) | The NGO entity IS the tenant registry |
| `Beneficiary` | `ngo_id` | Scoped to creating NGO |
| `Marketer` | `ngo_id` | Scoped to associated NGO |
| `User` | `ngo_id` | Linked to a specific NGO |
| `AuditLog` | `associationId` | Scoped to the acting user's NGO |
| `Notification` | `associationId` | Scoped to the recipient's NGO |

### Tenant-Aware Data Access

```javascript
// Admin/PDO — view data for a specific tenant
const beneficiaries = await apiService.fetchTenantBeneficiaries("ngo-id-123");

// NGO-scoped user — RLS automatically filters to their own NGO
const beneficiaries = await apiService.fetchBeneficiaries();
// ← backend returns only records matching user.ngo_id
```

### Tenant Context Provider

The `TenantContext` React provider manages active tenant state:

```javascript
import { useTenant } from "@/context/TenantContext";

const { activeTenantId, tenants, setActiveTenant, canSwitchTenant } = useTenant();
```

- **platform_admin / pdo**: Can switch between all tenants via `TenantSwitcher` dropdown
- **ngo_manager / marketer / researcher**: Locked to their own NGO automatically
- Active tenant is persisted in `localStorage`

### Tenant Switching UI

The `TenantSwitcher` component appears in the top bar for multi-tenant users,
allowing them to filter the entire platform view by a specific NGO.

### Security Verification

```http
POST /api/functions/verifyTenantIsolation
Authorization: Bearer <admin_or_pdo_token>

# Optional: verify specific tenants
{ "tenant_ids": ["ngo-id-1", "ngo-id-2"] }

# Or verify all
{}
```

**Response:**

```json
{
  "success": true,
  "overall_status": "PASS",
  "total_tenants_verified": 5,
  "tenants_passed": 5,
  "tenants_failed": 0,
  "results": [
    {
      "tenant_id": "6a2acef4dbe74042c48129ec",
      "tenant_name": "جمعية البر الخيرية",
      "status": "pass",
      "checks": {
        "beneficiaries": { "total": 120, "cross_tenant_leaks": 0, "pass": true },
        "marketers":    { "total": 5,   "cross_tenant_leaks": 0, "pass": true },
        "users":        { "total": 3,   "cross_tenant_leaks": 0, "pass": true },
        "audit_logs":   { "total": 45,  "cross_tenant_leaks": 0, "pass": true }
      }
    }
  ]
}
```

> Run `verifyTenantIsolation` periodically (e.g., via scheduled automation) to
> detect any data leakage between tenants.

### Tenant Lifecycle

| Operation | Endpoint | Roles |
|-----------|----------|-------|
| Create tenant (NGO) | `POST /api/entities/NGO` | platform_admin |
| Update tenant | `PATCH /api/entities/NGO/{id}` | platform_admin |
| Archive tenant | `PATCH /api/entities/NGO/{id}` → `status: "archived"` | platform_admin |
| Delete tenant | `DELETE /api/entities/NGO/{id}` | platform_admin |
| Verify isolation | `POST /api/functions/verifyTenantIsolation` | platform_admin, pdo |

---

## 👥 The 5 User Roles (RBAC)

| Role | Key | Access |
|------|-----|--------|
| مدير المنصة | `platform_admin` | Full access to all data and settings |
| مدير منظمة | `ngo_manager` | Manage his NGO's beneficiaries, marketers, and reports |
| باحث ميداني | `researcher` | Register and edit the cases he created |
| مسوّق | `marketer` | View his NGO's shareable cases for campaigns |
| مسؤول حماية البيانات | `pdo` | Read-only audit and compliance access |

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
| `reports:view` | ✓ | ✓ | ✓ | ✓ | ✓ |

### Data Isolation (RLS)

The backend enforces three tiers of data isolation server-side:

| Role | Sees |
|------|------|
| `platform_admin`, `pdo` | All records across all NGOs |
| `ngo_manager`, `marketer` | Only records belonging to their NGO |
| `researcher` | Only records they created (`created_by_id`) |

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

---

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
functions/
├── generateReport.js      # Reporting engine (5 report types + CSV export)
├── sendNotification.js    # Multi-recipient notification service
├── logAudit.js            # Immutable audit trail writer
└── getUserPermissions.js  # Role-based permission resolver
entities/
├── NGO.json              # NGO schema + RLS
├── Beneficiary.json      # Beneficiary schema + RLS (50+ fields)
├── Marketer.json         # Marketer schema + RLS
├── Notification.json     # Notification schema + RLS
├── AuditLog.json         # Audit log schema + RLS
└── User.json             # User entity (platform-managed)
```

### Data Flow

```
Page / Component → Domain Service → apiService.js → Adapter → Backend SDK
```

### NPM Packages

Core: `@base44/sdk` · `react` · `@tanstack/react-query` · `react-router-dom` · `framer-motion` · `recharts` · `zod` · `date-fns` · `jspdf` · `html2canvas`

---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server
npm run dev
```

> **Dev-only:** a Technical Overview page for engineers is available at `/dev/overview`
> (rendered only in development mode).

---

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

### Immutability

- **Audit log entries are immutable** — enforced at the database level via RLS.
- `UPDATE` and `DELETE` operations are disabled for all roles.
- Once written, a log entry can never be modified or removed.

### Data Retention

- Active logs retained for a **minimum of 6 months**.
- Long-term archival/deletion policy: logs older than 6 months may be archived to cold storage (future enhancement).

---

## 🔔 Notification Center

Real-time notification system with per-user delivery and type-based preferences.

### Notification Types

| Type | Trigger |
|------|---------|
| `case_update` | Beneficiary status change |
| `task_assigned` | New task assignment |
| `message` | Direct message |
| `system_alert` | Platform-wide announcement |
| `import_complete` | Bulk import finished |
| `status_change` | Any entity status change |
| `role_change` | User role modification |

### Architecture

```
Entity Automation (Beneficiary status change)
        │
        ▼
sendNotification (backend function)
        │
        ▼
Notification Entity (per-user records)
        │
        ▼
Real-time subscription → Frontend NotificationCenter
```

---

## 🛠 Tech Stack

React 18 · Vite · Tailwind CSS · shadcn/ui (Radix) · Framer Motion · Recharts ·
TanStack Query · Zod · React Router v6 · Deno Edge Functions

---

**Built by [Mohamed Munibari](https://tomybarq.com) / Tomybarq**