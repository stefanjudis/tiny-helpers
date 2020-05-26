const got = require('got');

async function fetchContributors({ page = 1, options }) {
  const response = await got({
    url: `https://api.github.com/repos/stefanjudis/tiny-helpers/contributors?per_page=100&page=${page}`,
    ...options,
  });

  const contributors = JSON.parse(response.body)
    .map((contributor) => contributor.login)
    .filter((contributor) => contributor !== 'stefanjudis');

  const match = response.headers.link.match(
    /^<.*?&page=(?<nextPage>.*?)>; rel="next".*$/
  );

  return match
    ? [
        ...contributors,
        ...(await fetchContributors({ page: +match.groups.nextPage, options })),
      ]
    : contributors;
}

module.exports = async function () {
  //  don't hit the API on every rebuild due to rate limits
  if (process.env.NODE_ENV === 'production') {
    try {
      const { GITHUB_ACCESS_TOKEN } = process.env;
      if (!GITHUB_ACCESS_TOKEN) {
        throw new Error('Please define GITHUB_ACCESS_TOKEN');
      }
      const options = {
        headers: {
          authorization: `token 6e4e03c71b3372b70e391b281335eec349adbb17`,
        },
      };

      return await fetchContributors({ options });
    } catch (e) {
      console.error(e);
      return [];
    }
  } else {
    return ['stefanjudis', 'stefanjudis', 'stefanjudis'];
  }
};
