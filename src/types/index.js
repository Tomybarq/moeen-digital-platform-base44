/**
 * @fileoverview Central Type Definitions (JSDoc) — Mo'een Platform
 * Field names mirror the SQL column names exactly so the backend engineer
 * can map these 1:1 to database tables.
 */

/**
 * @typedef {Object} Beneficiary
 * @property {string} id              - Primary key (UUID / row id)
 * @property {string} full_name       - Head-of-household full name (required)
 * @property {string} phone           - Saudi mobile, format 05XXXXXXXX (required)
 * @property {string} [national_id]   - Saudi ID, starts with 1 or 2, 10 digits
 * @property {number} [age]           - 1–120
 * @property {string} city            - City (required)
 * @property {string} [district]
 * @property {("مادي"|"صحي"|"تعليمي"|"اجتماعي"|"متعدد")} case_type
 * @property {("عاجل"|"مرتفع"|"متوسط"|"منخفض")} priority
 * @property {("active"|"supported"|"archived")} status
 * @property {string} [ngo_id]        - FK → NGO.id
 * @property {string} [ngo_name]
 * @property {string} [researcher_name]
 * @property {string[]} [documents]   - File URLs
 * @property {string} created_date    - ISO timestamp (set by backend)
 */

/**
 * @typedef {Object} NGO
 * @property {string} id
 * @property {string} name                - Organization name (required)
 * @property {string} responsible_person  - (required)
 * @property {string} phone               - (required)
 * @property {string} email               - (required)
 * @property {string} [donation_url]
 * @property {string} [city]
 * @property {("خيرية"|"تعليمية"|"صحية"|"بيئية"|"اجتماعية"|"أخرى")} [category]
 * @property {("active"|"archived")} status
 */

/**
 * @typedef {Object} Marketer
 * @property {string} id
 * @property {string} full_name        - (required)
 * @property {string} phone            - (required)
 * @property {string} [email]
 * @property {string} [city]
 * @property {string} [ngo_id]         - FK → NGO.id
 * @property {string} ngo_name         - (required)
 * @property {string} [specialization]
 * @property {number} [campaigns_count]
 * @property {("active"|"archived")} status
 */

/**
 * @typedef {Object} AuditLog
 * @property {number|string} log_id
 * @property {string} log_text
 * @property {("ngo"|"researcher"|"campaign"|"beneficiary")} log_type
 * @property {string} created_at
 */

export {}; // module marker — typedefs are consumed via JSDoc imports