/**
 * matches all strings enclosed in brackets
 */
const STRINGS_IN_BRACKETS_REGEXP = /(\(.+?\))/g;
/**
 * matches one or more whitespace characters
 */
const ONE_OR_MORE_WHITESPACE_REGEXP = /\s+/g;
/**
 * something we can use to identify brackets with dynamic labels
 */
const DYNAMIC_LABEL_MARKER = "${";

/**
 * Capitalize first letter, leave the rest as-is.
 * @param str string to process
 */
export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Capitalize first letter, make the rest lower-case.
 * @param str string to process
 */
export function capitalizeFirstLetterOnly(str: string): string {
  return capitalizeFirstLetter(str.toLowerCase());
}

/**
 * Removes pieces of string that are enclosed in brackets and contain placeholders.
 * For example, for "label (avg: ${AVG})" it returns "label".
 * This is useful for annotations, because they do not replace the placeholders properly.
 * @param label label to process
 */
export function removeBracketsWithDynamicLabels(label: string): string {
  let result = label;
  const stringsInBrackets = label.match(STRINGS_IN_BRACKETS_REGEXP);
  if (stringsInBrackets) {
    for (const stringInBrackets of stringsInBrackets) {
      if (stringInBrackets.includes(DYNAMIC_LABEL_MARKER)) {
        // if this bracket contains dynamic label, we just remove it
        result = result.replace(stringInBrackets, "");
      }
    }
  }
  // we can end up with some extra spaces, so let's fix it
  result = result.replace(ONE_OR_MORE_WHITESPACE_REGEXP, " ").trim();
  return result;
}

/**
 * Simple hashing function to generate hash-based metric expression ID.
 * This function is insecure and outputs a hexadecimal string.
 * @param str string to encode
 * @return hexadecimal hash
 */
export function getHashForMetricExpressionId(str: string): string {
  return getShortHash(str);
}

/**
 * Simple hashing function to generate short hash for the given string.
 * This function is insecure and outputs a hexadecimal string.
 * @param str string to encode
 * @return hexadecimal hash
 */
export function getShortHash(str: string): string {
  const seed = 31;
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const result = 4294967296 * (2097151 & h2) + (h1 >>> 0);
  return result.toString(16);
}
