import { RootState } from '../../../store';

export const selectCartItems = (state: RootState) => state.cart.items;

export const selectSubtotal = (state: RootState) =>
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

export const selectDiscount = (state: RootState) => {
  const rates: Record<string, number> = { SUMMER10: 0.1, SPECIAL20: 0.2 };
  return selectSubtotal(state) * (rates[state.cart.discountCode ?? ''] ?? 0);
};

export const selectTax = (state: RootState) =>
  (selectSubtotal(state) - selectDiscount(state)) * state.cart.taxRate;

export const selectCartSummary = (state: RootState) => ({
  subtotal: selectSubtotal(state),
  discount: selectDiscount(state),
  tax: selectTax(state),
  shipping: state.cart.items.length > 0 ? state.cart.shippingCost : 0,
  total:
    selectSubtotal(state) -
    selectDiscount(state) +
    selectTax(state) +
    (state.cart.items.length > 0 ? state.cart.shippingCost : 0),
  itemCount: state.cart.items.reduce((count, item) => count + item.quantity, 0),
});
