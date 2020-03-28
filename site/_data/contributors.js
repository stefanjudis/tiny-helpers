const got = require('got');

module.exports = async function() {
  // don't hit the API on every rebuild due to rate limits
  if (process.env.NODE_ENV === 'production') {
    try {
      const options = {};
      const { GITHUB_ACCESS_TOKEN } = process.env;

      if (GITHUB_ACCESS_TOKEN) {
        options.headers = {
          authorization: `token ${GITHUB_ACCESS_TOKEN}`
        };
      }

      const response = await got(
        'https://api.github.com/repos/stefanjudis/tiny-helpers/contributors?per_page=100',
        options
      );

      return JSON.parse(response.body)
        .map(contributor => contributor.login)
        .filter(contributor => contributor !== 'stefanjudis');
    } catch (e) {
      console.error(e);
      return [];
    }
  } else {
    return ['stefanjudis', 'stefanjudis', 'stefanjudis'];
  }
};
