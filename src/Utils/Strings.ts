// src/Utils/Strings.ts

/**
 * Convert a input string to title case
 * @param input Input String `helloWorld`
 *
 * @returns Title case string
 *
 * @example
 * ```ts
 * const resultString = toTitleCase('contact')
 * // resultString = 'Contact'
 * ```
 */
export function toTitleCase(input: string): string {
  return input
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
    .join(' ');
}
