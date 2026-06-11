/**
 * Error Logging & Monitoring — Mo'een Platform
 * Centralised runtime error tracking with context capture.
 * Logs to console (dev) and could be wired to an external service.
 */

const LOG_LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };
const CURRENT_LEVEL = import.meta.env.DEV ? 0 : 1;

function timestamp() {
  return new Date().toISOString();
}

function buildEntry(level, message, context = {}) {
  return {
    level,
    message,
    timestamp: timestamp(),
    url: window.location.pathname,
    userAgent: navigator.userAgent.slice(0, 100),
    ...context,
  };
}

// In-memory ring buffer — last 100 entries accessible for System Health display
const _buffer = [];
const MAX_BUFFER = 100;

function push(entry) {
  _buffer.push(entry);
  if (_buffer.length > MAX_BUFFER) _buffer.shift();
}

export const ErrorLogger = {
  debug(message, context) {
    if (LOG_LEVELS.debug < CURRENT_LEVEL) return;
    const entry = buildEntry("debug", message, context);
    push(entry);
    console.debug("[Mo'een]", message, context ?? "");
  },

  info(message, context) {
    if (LOG_LEVELS.info < CURRENT_LEVEL) return;
    const entry = buildEntry("info", message, context);
    push(entry);
    console.info("[Mo'een]", message, context ?? "");
  },

  warn(message, context) {
    if (LOG_LEVELS.warn < CURRENT_LEVEL) return;
    const entry = buildEntry("warn", message, context);
    push(entry);
    console.warn("[Mo'een]", message, context ?? "");
  },

  /**
   * Log an error — the primary method for catching runtime exceptions.
   * @param {string} message  Human-readable description
   * @param {Error|object} error  The thrown error or context object
   * @param {object} [extra]  Additional metadata
   */
  error(message, error, extra = {}) {
    const entry = buildEntry("error", message, {
      error_message: error?.message ?? String(error),
      stack: error?.stack?.slice(0, 500) ?? null,
      ...extra,
    });
    push(entry);
    console.error("[Mo'een ERROR]", message, error ?? "", extra);
  },

  /** Return a copy of the in-memory buffer for the System Health panel. */
  getRecentErrors() {
    return _buffer.filter(e => e.level === "error").slice(-20).reverse();
  },

  /** Return all recent log entries. */
  getAll() {
    return [..._buffer].reverse();
  },

  /** Clear the buffer. */
  clear() {
    _buffer.length = 0;
  },
};

/**
 * Global unhandled error & promise rejection capture.
 * Call once from main.jsx or App.jsx.
 */
export function initGlobalErrorHandlers() {
  window.addEventListener("error", (event) => {
    ErrorLogger.error("Unhandled JS Error", event.error, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });

  window.addEventListener("unhandledrejection", (event) => {
    ErrorLogger.error("Unhandled Promise Rejection", event.reason, {
      promise: String(event.promise),
    });
  });
}