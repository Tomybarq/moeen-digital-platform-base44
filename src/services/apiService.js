/**
 * @fileoverview Centralized API Service — Mo'een Platform
 *
 * SINGLE data-access layer for the entire frontend. UI components NEVER talk
 * to a data source directly — they only call the async functions below.
 *
 * ── BACKEND ENGINEER: HOW TO PLUG IN FIREBASE / SQL ──────────────────────────
 * 1. Each function below is `async` and returns a Promise — the UI already
 *    awaits them, so swapping the implementation requires NO UI changes.
 * 2. Entity functions currently delegate to the Base44 SDK. Replace the body
 *    of each function with your Firebase/Firestore or REST→SQL call, keeping
 *    the same return shape (see typedefs in `src/types/index.js`).
 * 3. Analytics/chart functions currently resolve mock data from
 *    `src/lib/mockData.js`. Replace them with real aggregate queries
 *    (e.g. SQL GROUP BY month) keeping the same array shapes.
 * 4. Configuration (API keys, base URL) comes from environment variables —
 *    see `.env.example` at the project root.
 */

import { base44 } from "@/api/base44Client";
import {
  mockGrowthSeries,
  mockPrioritySeries,
  mockStatusDistribution,
  mockNgos,
  mockAuditLogs,
} from "@/lib/mockData";

// ─────────────────────────────────────────────────────────────────────────────
// NGOs
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch NGOs, optionally filtered.
 * 🔌 SWAP POINT: replace with `SELECT * FROM ngos WHERE status = ?`
 * or `getDocs(query(collection(db, "ngos"), where(...)))`.
 * @param {Object} [filter] - e.g. { status: "active" }
 * @param {string} [sort="-created_date"]
 * @param {number} [limit=200]
 * @returns {Promise<import("@/types").NGO[]>}
 */
export async function fetchNGOs(filter = {}, sort = "-created_date", limit = 200) {
  return base44.entities.NGO.filter(filter, sort, limit);
}

/** 🔌 SWAP POINT: `INSERT INTO ngos (...)`. @returns {Promise<import("@/types").NGO>} */
export async function createNGO(data) {
  return base44.entities.NGO.create(data);
}

/** 🔌 SWAP POINT: `UPDATE ngos SET ... WHERE id = ?`. */
export async function updateNGO(id, data) {
  return base44.entities.NGO.update(id, data);
}

/** 🔌 SWAP POINT: `DELETE FROM ngos WHERE id = ?`. */
export async function deleteNGO(id) {
  return base44.entities.NGO.delete(id);
}

// ─────────────────────────────────────────────────────────────────────────────
// Beneficiaries
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch beneficiaries (most recent first).
 * 🔌 SWAP POINT: `SELECT * FROM beneficiaries ORDER BY created_date DESC LIMIT ?`.
 * NOTE: row-level access control (per-NGO isolation) must be re-implemented
 * server-side when migrating — see `src/lib/rbac.js` for the current rules.
 * @returns {Promise<import("@/types").Beneficiary[]>}
 */
export async function fetchBeneficiaries(sort = "-created_date", limit = 500) {
  return base44.entities.Beneficiary.list(sort, limit);
}

/** 🔌 SWAP POINT: `INSERT INTO beneficiaries (...)`. */
export async function createBeneficiary(data) {
  return base44.entities.Beneficiary.create(data);
}

/** 🔌 SWAP POINT: `UPDATE beneficiaries SET ... WHERE id = ?`. */
export async function updateBeneficiary(id, data) {
  return base44.entities.Beneficiary.update(id, data);
}

/** 🔌 SWAP POINT: `DELETE FROM beneficiaries WHERE id = ?`. */
export async function deleteBeneficiary(id) {
  return base44.entities.Beneficiary.delete(id);
}

// ─────────────────────────────────────────────────────────────────────────────
// Marketers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 🔌 SWAP POINT: `SELECT * FROM marketers WHERE status = ?`.
 * @returns {Promise<import("@/types").Marketer[]>}
 */
export async function fetchMarketers(filter = {}, sort = "-created_date", limit = 200) {
  return base44.entities.Marketer.filter(filter, sort, limit);
}

/** 🔌 SWAP POINT: `INSERT INTO marketers (...)`. */
export async function createMarketer(data) {
  return base44.entities.Marketer.create(data);
}

/** 🔌 SWAP POINT: `UPDATE marketers SET ... WHERE id = ?`. */
export async function updateMarketer(id, data) {
  return base44.entities.Marketer.update(id, data);
}

/** 🔌 SWAP POINT: `DELETE FROM marketers WHERE id = ?`. */
export async function deleteMarketer(id) {
  return base44.entities.Marketer.delete(id);
}

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard Analytics  (currently MOCK — replace with aggregate queries)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Monthly platform growth series for the area chart.
 * 🔌 SWAP POINT: `SELECT month, COUNT(*) ... GROUP BY month`.
 * @returns {Promise<Array<{month: string}>>}
 */
export async function fetchGrowthSeries() {
  return Promise.resolve(mockGrowthSeries);
}

/**
 * Case counts per priority per month for the stacked bar chart.
 * 🔌 SWAP POINT: `SELECT month, priority, COUNT(*) ... GROUP BY month, priority`.
 */
export async function fetchPrioritySeries() {
  return Promise.resolve(mockPrioritySeries);
}

/**
 * Beneficiary status distribution for the donut chart.
 * 🔌 SWAP POINT: `SELECT status, COUNT(*) FROM beneficiaries GROUP BY status`.
 */
export async function fetchStatusDistribution() {
  return Promise.resolve(mockStatusDistribution);
}

/**
 * Top NGOs ranked by case count.
 * 🔌 SWAP POINT: `SELECT ngo_id, COUNT(*) ... GROUP BY ngo_id ORDER BY 2 DESC LIMIT 5`.
 */
export async function fetchTopNGOs() {
  return Promise.resolve(mockNgos);
}

/**
 * Recent platform activity / audit trail.
 * 🔌 SWAP POINT: `SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT ?`.
 * @returns {Promise<import("@/types").AuditLog[]>}
 */
export async function fetchAuditLogs() {
  return Promise.resolve(mockAuditLogs);
}