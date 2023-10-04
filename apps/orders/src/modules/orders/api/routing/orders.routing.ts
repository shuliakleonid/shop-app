const baseUrlShoppingCart = '/orders';

export const ordersEndpoints = {
  getAll: () => `${baseUrlShoppingCart}`,
  get: (id: string) => `${baseUrlShoppingCart}/${id}`,
  add: () => `${baseUrlShoppingCart}`,
  update: (id: string) => `${baseUrlShoppingCart}/${id}`,
  delete: (id: string) => `${baseUrlShoppingCart}/${id}`,
};
