const baseUrlProduct = '/products';

export const productRoutes = {
  getAll: () => `${baseUrlProduct}`,
  getById: id => `${baseUrlProduct}/${id}`,
  create: () => `${baseUrlProduct}`,
  update: id => `${baseUrlProduct}/${id}`,
  delete: id => `${baseUrlProduct}/${id}`,
  getProduct: id => `${baseUrlProduct}/${id}`,
};
