export interface IProduct {
  productId: number;
  supplierId: number;
  name: string;
  description: string;
  price: number;
  sku: string;
  unit: string;
  imgName: string;
  discount: number | null;
}

export const getDiscountedPrice = (product: Pick<IProduct, 'price' | 'discount'>): number => {
  const discount = product.discount ?? 0;
  return product.price * (1 - discount);
};
