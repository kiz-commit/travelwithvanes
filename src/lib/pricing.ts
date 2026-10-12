/**
 * Currency used for Stripe checkout of self-guided trip guides.
 * Change both values together if you switch Stripe to AUD.
 */
export const GUIDE_CURRENCY = "usd";
export const GUIDE_CURRENCY_LABEL = "US$";

export function formatGuidePrice(price: number): string {
  const rounded = Number.isInteger(price) ? String(price) : price.toFixed(2);
  return `${GUIDE_CURRENCY_LABEL}${rounded}`;
}
