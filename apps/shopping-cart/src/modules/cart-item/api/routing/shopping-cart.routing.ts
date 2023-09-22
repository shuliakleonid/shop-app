const baseUrlShoppingCart = '/cart';

export const shoppingCartEndpoints = {
  getCartItems: () => `${baseUrlShoppingCart}`,
  add: () => `${baseUrlShoppingCart}`,
  update: () => `${baseUrlShoppingCart}`,
  delete: (id: string) => `${baseUrlShoppingCart}/${id}`,
};
