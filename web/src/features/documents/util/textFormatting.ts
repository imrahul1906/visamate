/**
 * Shared text formatting utilities for document services
 */

/**
 * Wrap text in editorial hint markers: [[HINT: msg]]
 * These are rendered as styled callouts in preview but stripped before export
 */
export const hint = (msg: string): string => `[[HINT: ${msg}]]`;

/**
 * Remove all [[HINT: ...]] editorial annotations and normalize whitespace
 * Used to clean text before writing to .docx
 */
export function stripHints(text: string): string {
    return (
        text
            .replace(/\[\[HINT:[^\]]*\]\]/g, "") // Remove hint blocks
            .replace(/[ \t]+\n/g, "\n")          // Collapse trailing spaces on lines
            .replace(/\n{3,}/g, "\n\n")          // Collapse 3+ newlines to 2
            .trim()
    );
}
