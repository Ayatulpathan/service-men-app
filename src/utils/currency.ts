/**
 * Formats a number into Bangladeshi Taka (BDT ৳) with English or Bangla digits
 */
export function formatBDT(amount: number, lang: 'en' | 'bn' = 'en'): string {
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0
  }).format(amount);

  if (lang === 'bn') {
    const banglaDigits: Record<string, string> = {
      '0': '০',
      '1': '১',
      '2': '২',
      '3': '৩',
      '4': '৪',
      '5': '৫',
      '6': '৬',
      '7': '৭',
      '8': '৮',
      '9': '৯',
      ',': ','
    };
    const bnFormatted = formatted.replace(/[0-9,]/g, match => banglaDigits[match] || match);
    return `৳${bnFormatted}`;
  }

  return `৳${formatted}`;
}
