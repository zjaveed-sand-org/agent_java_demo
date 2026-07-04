export interface ICartItem {
  cartItemId: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imgName: string;
  discount: number | null;
  lineTotal: number;
}

export interface ICartState {
  sessionId: string;
  cartId: string;
  createdAt: string;
  updatedAt: string;
  items: ICartItem[];
  subtotal: number;
  discountTotal: number;
  total: number;
  itemCount: number;
}

export const createEmptyCartState = (sessionId: string): ICartState => {
  const timestamp = new Date().toISOString();

  return {
    sessionId,
    cartId: `cart-${sessionId}`,
    createdAt: timestamp,
    updatedAt: timestamp,
    items: [],
    subtotal: 0,
    discountTotal: 0,
    total: 0,
    itemCount: 0,
  };
};
