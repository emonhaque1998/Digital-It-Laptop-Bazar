export function formatPrice(amountBDT: number, currency: 'BDT' | 'USD' = 'BDT', rate: number = 120): string {
  if (currency === 'USD') {
    const usd = Math.round(amountBDT / rate);
    return `$${usd.toLocaleString()}`;
  }
  return `৳${amountBDT.toLocaleString()}`;
}

export function calculateDiscountPercentage(price: number, originalPrice: number): number {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}
