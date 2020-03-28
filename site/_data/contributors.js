const got = require('got');

module.exports = async function() {
  // don't hit the API on every rebuild due to rate limits
  if (process.env.NODE_ENV === 'production') {
    try {
      const response = await got(
        'https://api.github.com/repos/stefanjudis/tiny-helpers/contributors?per_page=100'
      );

      return JSON.parse(response.body)
        .map(contributor => contributor.login)
        .filter(contributor => contributor !== 'stefanjudis');
    } catch (e) {
      return [];
    }
  } else {
    return ['stefanjudis', 'stefanjudis', 'stefanjudis'];
  }
};
