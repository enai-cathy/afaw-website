/**
 * Convert a string to a URL-friendly slug
 * @param {string} text - The text to slugify
 * @returns {string} - URL-friendly slug
 */
export const slugify = (text) => {
  if (!text) return '';
  
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
};

/**
 * Extract ID from a slug that has format "title-slug-123"
 * @param {string} slug - The slug containing ID at the end
 * @returns {number|null} - Extracted ID or null
 */
export const extractIdFromSlug = (slug) => {
  if (!slug) return null;
  
  // Match ID at the end of slug (e.g., "my-blog-post-123" -> 123)
  const match = slug.match(/-(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
};

/**
 * Create a slug with ID appended (for uniqueness)
 * @param {string} title - The title text
 * @param {number} id - The ID to append
 * @returns {string} - Slug with ID (e.g., "my-blog-post-123")
 */
export const createSlugWithId = (title, id) => {
  const titleSlug = slugify(title);
  return `${titleSlug}-${id}`;
};
