const { isAuthorized, queryFauna } = require('./_util');

async function getHelpersByStargazer(user) {
  const data = await queryFauna(`
    query {
      helperByStargazers(stargazers: "${user}") {
        data {
          url
        }
      }
    }
  `);

  return data.helperByStargazers.data;
}

module.exports = async (req, res) => {
  try {
    await isAuthorized(req);

    const { user } = req.query;
    const helpers = await getHelpersByStargazer(user);
    res.status(200).json(helpers);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
