import axios from 'axios';
import { api } from './config';
import { ICartState } from '../types/cart';

export interface IAddCartItemRequest {
  productId: number;
  quantity: number;
}

export interface IUpdateCartItemRequest {
  quantity: number;
}

const getCartUrl = (sessionId: string): string =>
  `${api.baseURL}${api.endpoints.cart}/${encodeURIComponent(sessionId)}`;

export const fetchCart = async (sessionId: string): Promise<ICartState> => {
  const { data } = await axios.get<ICartState>(getCartUrl(sessionId));
  return data;
};

export const addCartItem = async (
  sessionId: string,
  payload: IAddCartItemRequest,
): Promise<ICartState> => {
  const { data } = await axios.post<ICartState>(`${getCartUrl(sessionId)}/items`, payload);
  return data;
};

export const updateCartItem = async (
  sessionId: string,
  itemId: number,
  payload: IUpdateCartItemRequest,
): Promise<ICartState> => {
  const { data } = await axios.put<ICartState>(`${getCartUrl(sessionId)}/items/${itemId}`, payload);
  return data;
};

export const removeCartItem = async (sessionId: string, itemId: number): Promise<ICartState> => {
  const { data } = await axios.delete<ICartState>(`${getCartUrl(sessionId)}/items/${itemId}`);
  return data;
};

export const clearCart = async (sessionId: string): Promise<ICartState> => {
  const { data } = await axios.delete<ICartState>(getCartUrl(sessionId));
  return data;
};
