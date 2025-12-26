/**
 * Get current date key in America/Sao_Paulo timezone
 * Format: YYYY-MM-DD
 */
export function getDateKey(): string {
    return new Date().toLocaleDateString('en-CA', {
        timeZone: 'America/Sao_Paulo'
    });
}
