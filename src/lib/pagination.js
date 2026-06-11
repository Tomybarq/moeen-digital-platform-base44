/**
 * Pagination utilities — Mo'een Platform
 */

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
export const DEFAULT_PAGE_SIZE = 20;

/**
 * Slice a list for the current page.
 * @param {Array}  list
 * @param {number} page      1-based page index
 * @param {number} pageSize
 * @returns {{ items: Array, totalPages: number, totalItems: number }}
 */
export function paginate(list, page, pageSize) {
  const totalItems = list.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage   = Math.min(Math.max(1, page), totalPages);
  const start      = (safePage - 1) * pageSize;
  const items      = list.slice(start, start + pageSize);
  return { items, totalPages, totalItems, currentPage: safePage };
}

/**
 * Generate the page numbers to display (with ellipsis gaps).
 * Returns an array of numbers and null for gaps.
 */
export function getPageRange(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [];
  pages.push(1);
  if (current > 3) pages.push(null); // ellipsis
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i);
  }
  if (current < total - 2) pages.push(null); // ellipsis
  pages.push(total);
  return pages;
}