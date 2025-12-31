/**
 * Fuse.js - Lightweight fuzzy-search library
 * Client-side search without external dependencies
 * License: Apache-2.0
 *
 * This is a minimal inline version for search functionality
 */

class Fuse {
  constructor(list, options = {}) {
    this.list = list;
    this.options = {
      keys: options.keys || [],
      threshold: options.threshold || 0.6,
      includeScore: options.includeScore || false,
      minMatchCharLength: options.minMatchCharLength || 1,
    };
  }

  search(pattern) {
    if (!pattern || pattern.length < this.options.minMatchCharLength) {
      return [];
    }

    const results = [];
    const lowerPattern = pattern.toLowerCase();

    this.list.forEach((item, index) => {
      let bestScore = 1;
      let matched = false;

      this.options.keys.forEach((key) => {
        const value = this._getValue(item, key);
        if (!value) return;

        const lowerValue = value.toLowerCase();
        const score = this._calculateScore(lowerPattern, lowerValue);

        if (score < this.options.threshold) {
          matched = true;
          bestScore = Math.min(bestScore, score);
        }
      });

      if (matched) {
        const result = {
          item,
          refIndex: index,
        };
        if (this.options.includeScore) {
          result.score = bestScore;
        }
        results.push(result);
      }
    });

    // Sort by score (lower is better)
    return results.sort((a, b) => {
      const scoreA = this.options.includeScore ? a.score : 0;
      const scoreB = this.options.includeScore ? b.score : 0;
      return scoreA - scoreB;
    });
  }

  _getValue(obj, key) {
    const keys = key.split('.');
    let value = obj;
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return null;
      }
    }
    return value ? String(value) : null;
  }

  _calculateScore(pattern, text) {
    // Simple fuzzy matching score
    if (text.includes(pattern)) {
      // Exact substring match - best score
      return 0.1;
    }

    // Check if all characters of pattern exist in text in order
    let patternIndex = 0;
    let matchCount = 0;

    for (let i = 0; i < text.length && patternIndex < pattern.length; i++) {
      if (text[i] === pattern[patternIndex]) {
        matchCount++;
        patternIndex++;
      }
    }

    if (matchCount === 0) return 1; // No match

    // Calculate score based on match ratio
    const score = 1 - matchCount / pattern.length;
    return score;
  }
}

export default Fuse;
