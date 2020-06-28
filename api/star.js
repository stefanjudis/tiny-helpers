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

async function getHelperByUrl(url) {
  const data = await queryFauna(`
    query {
      helperByUrl(url: "${url}") {
        data {
          _id
          url
          starGazers
        }
      }
    }
  `);

  const [helper] = data.helperByUrl.data;

  return helper;
}

module.exports = async (req, res) => {
  const [, token] = req.headers.authorization.split(' ');
  const { helperUrl, user } = req.body;

  const decodedToken = jwt.decode(token, { complete: true });

  client.getSigningKey(decodedToken.header.kid, (err, key) => {
    // todo error handling

    jwt.verify(token, key.getPublicKey(), async (err, decoded) => {
      const helper = await getHelperByUrl(helperUrl);

      if (!helper) {
        const data = await queryFauna(`
          mutation {
            createHelper(data: {url: "${helperUrl}", starGazers: ["${user}"]}) {
              _id
              url
              starGazers
            }
          }
        `);
      } else {
        const starGazers = [...helper.starGazers, user];

        const data = await queryFauna(`
          mutation {
            updateHelper(id: ${helper._id}, data: { url: "${
          helper.url
        }", starGazers: [
          ${starGazers.map((email) => `"${email}"`).join(',')}]}) {
              _id
              url
              starGazers
            }
          }
        `);
      }

      res.status(201).json({ msg: `Stared ${helperUrl}` });
    });
  });
};
