export const baseUrlAuth = '/auth';

export const authEndpoints = {
  registration: () => `${baseUrlAuth}/registration`,
  login: () => `${baseUrlAuth}/login`,
  logout: () => `${baseUrlAuth}/logout`,
  updateTokens: () => `${baseUrlAuth}/update-tokens`,
  me: () => `${baseUrlAuth}/me`,
};
