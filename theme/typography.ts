/**
 * Shared typography styles for text components.
 *
 * Usage:
 *   <Text className={typography.title}>Title</Text>
 *   <Text className={typography.body}>Body text</Text>
 *   <Text className={typography.caption}>Caption text</Text>
 *
 * Guidelines:
 * - title   → page titles, section headers
 * - body    → primary readable content
 * - caption → secondary or helper text
 */

export const typography = {
  /** Page titles and section headers */
  title: 'text-xl font-semibold',

  /** Standard body text */
  body: 'text-base font-sans',

  /** Small, muted helper text */
  caption: 'text-sm font-sans text-muted'
};
