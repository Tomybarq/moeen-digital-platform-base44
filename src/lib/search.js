/**
 * Full-text search utilities for Arabic content.
 * Normalizes diacritics (tashkeel), hamza variants, and alef forms
 * so searches are accent/variant-insensitive.
 */

/**
 * Normalize an Arabic string for comparison:
 * - Remove diacritics (tashkeel)
 * - Normalize alef variants → ا
 * - Normalize hamza variants
 * - Lowercase Latin characters
 * @param {string} str
 * @returns {string}
 */
export function normalizeArabic(str) {
  if (!str) return "";
  return str
    .replace(/[\u064B-\u065F\u0670]/g, "")   // strip tashkeel & tatweel diacritics
    .replace(/[\u0622\u0623\u0625\u0671]/g, "\u0627") // normalize alef variants → ا
    .replace(/\u0629/g, "\u0647")             // ta marbuta → ha
    .replace(/\u064A/g, "\u06CC")             // ya variants
    .toLowerCase()
    .trim();
}

/**
 * Returns true if any of the provided field values contain the search term
 * after Arabic normalization.
 * @param {string} term        — the search query
 * @param {string[]} values    — field values to search within
 * @returns {boolean}
 */
export function matchesSearch(term, values) {
  if (!term) return true;
  const normalizedTerm = normalizeArabic(term);
  return values.some(v => normalizeArabic(v).includes(normalizedTerm));
}