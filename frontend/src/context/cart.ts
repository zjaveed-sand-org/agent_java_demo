export interface ICartProduct {
  productId: number;
  name: string;
  price: number;
  imgName: string;
  discount?: number | null;
}

export interface ICartItem extends ICartProduct {
  quantity: number;
}

export const CART_STORAGE_KEY = 'octocat-cart';

export function unitPriceCents(product: ICartProduct): number {
  return Math.round(product.price * 100 * (1 - (product.discount ?? 0)));
}

export function cartTotals(items: ICartItem[]) {
  const subtotal = items.reduce((sum, item) => sum + unitPriceCents(item) * item.quantity, 0);
  const shipping = items.length > 0 && subtotal <= 10000 ? 2500 : 0;
  return { subtotal, shipping, total: subtotal + shipping };
}

export function isCartItem(value: unknown): value is ICartItem {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const item = value as Record<string, unknown>;
  return Number.isSafeInteger(item.productId)
    && typeof item.name === 'string'
    && typeof item.imgName === 'string'
    && typeof item.price === 'number' && Number.isFinite(item.price) && item.price >= 0
    && (item.discount == null || (typeof item.discount === 'number'
      && Number.isFinite(item.discount) && item.discount >= 0 && item.discount <= 1))
    && Number.isSafeInteger(item.quantity) && Number(item.quantity) > 0;
}
