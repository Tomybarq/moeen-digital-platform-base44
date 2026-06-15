/**
 * AuditLogService — Domain service for audit log operations.
 *
 * All audit log data access flows through apiService → adapter.
 * This service adds business logic: association-based filtering,
 * pagination, export, and query building.
 */

import {
  fetchAuditLogs,
  createAuditLog,
  getAuditLogById,
  fetchAllAuditLogs,
} from "@/services/apiService";

const AuditLogService = {
  /**
   * Fetch paginated audit logs with optional filters.
   * @param {object} filters - { event_type, resource_type, user_id, associationId, dateFrom, dateTo }
   * @param {number} page - 1-based page number
   * @param {number} pageSize - items per page
   */
  async list(filters = {}, page = 1, pageSize = 50) {
    const skip = (page - 1) * pageSize;
    const query = {};

    if (filters.event_type) query.event_type = filters.event_type;
    if (filters.resource_type) query.resource_type = filters.resource_type;
    if (filters.user_id) query.user_id = filters.user_id;
    if (filters.associationId) query.associationId = filters.associationId;

    const result = await fetchAuditLogs({ query, sort: "-created_date", limit: pageSize, skip });
    return result;
  },

  /**
   * Fetch ALL matching audit logs (for export).
   */
  async exportAll(filters = {}) {
    const query = {};
    if (filters.event_type) query.event_type = filters.event_type;
    if (filters.resource_type) query.resource_type = filters.resource_type;
    if (filters.user_id) query.user_id = filters.user_id;
    if (filters.associationId) query.associationId = filters.associationId;

    return fetchAllAuditLogs({ query, sort: "-created_date" });
  },

  /**
   * Log an event to the audit trail.
   */
  async logEvent(eventData) {
    return createAuditLog(eventData);
  },

  /**
   * Get a single audit log entry by ID.
   */
  async getById(id) {
    return getAuditLogById(id);
  },
};

export default AuditLogService;