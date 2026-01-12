/**
 * Image Utilities for Next.js Image Component
 */

/**
 * Ensures image path starts with forward slash for Next.js Image component
 * @param {string} imagePath - The image path from database
 * @returns {string} - Properly formatted path with leading slash
 */
export const formatImagePath = (imagePath) => {
  if (!imagePath) return '/images/placeholder.png';

  // If it's already an absolute URL (http:// or https://), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // If it already starts with /, return as is
  if (imagePath.startsWith('/')) {
    return imagePath;
  }

  // Add leading slash
  return `/${imagePath}`;
};

/**
 * Get optimized image dimensions based on usage context
 * @param {string} context - Where the image is used (card, hero, thumbnail, etc.)
 * @returns {object} - Width and height for the image
 */
export const getImageDimensions = (context) => {
  const dimensions = {
    card: { width: 64, height: 64 },
    hero: { width: 1200, height: 630 },
    thumbnail: { width: 40, height: 40 },
    icon: { width: 24, height: 24 },
    logo: { width: 150, height: 48 },
  };

  return dimensions[context] || dimensions.card;
};


