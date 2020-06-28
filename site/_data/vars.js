module.exports = {
  isProduction: process.env.NODE_ENV === 'production',
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE,
};
