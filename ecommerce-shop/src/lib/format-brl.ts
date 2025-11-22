/**
 * Format a number as Brazilian Real currency
 * @param value - The numeric value to format
 * @returns Formatted string like "R$ 1.234,56"
 */
export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}
