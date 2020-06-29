const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const got = require('got');

const client = jwksClient({
  strictSsl: true,
  jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
});

async function queryFauna(query) {
  const { body } = await got.post('https://graphql.fauna.com/graphql', {
    headers: {
      authorization: `Bearer ${process.env.FAUNA_SECRET}`,
    },
    body: JSON.stringify({
      query: query,
    }),
    responseType: 'json',
  });

  if (body.errors) {
    throw new Error(body.errors.map(({ message }) => message).join('\n\n'));
  }

  return body.data;
}

async function isAuthorized(req) {
  const [, token] = req.headers.authorization.split(' ');
  const decodedToken = jwt.decode(token, { complete: true });

  return new Promise((resolve, reject) => {
    client.getSigningKey(decodedToken.header.kid, (err, key) => {
      if (err) return reject(err);

      jwt.verify(token, key.getPublicKey(), async (err, decoded) => {
        if (err) return reject(err);

        resolve(true);
      });
    });
  });
}

module.exports = {
  isAuthorized,
  queryFauna,
};
