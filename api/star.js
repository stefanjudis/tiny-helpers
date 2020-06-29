const { isAuthorized, queryFauna } = require('./_util');

async function getHelpersByUrl(url) {
  const data = await queryFauna(`
    query {
      helperByUrl(url: "${url}") {
        data {
          _id
          url
          stargazers
        }
      }
    }
  `);

  const [helper] = data.helperByUrl.data;

  return helper;
}

module.exports = async (req, res) => {
  try {
    await isAuthorized(req);

    const { helperUrl, user } = req.body;
    const helper = await getHelpersByUrl(helperUrl);

    if (!helper) {
      const data = await queryFauna(`
          mutation {
            createHelper(data: {url: "${helperUrl}", stargazers: ["${user}"]}) {
              _id
              url
              stargazers
            }
          }
        `);
    } else {
      console.log(helper);
      const stargazers = [...helper.stargazers, user];

      const data = await queryFauna(`
          mutation {
            updateHelper(id: ${helper._id}, data: { url: "${
        helper.url
      }", stargazers: [
          ${stargazers.map((email) => `"${email}"`).join(',')}]}) {
              _id
              url
              stargazers
            }
          }
        `);
    }

    res.status(201).json({ msg: `Stared ${helperUrl}` });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
