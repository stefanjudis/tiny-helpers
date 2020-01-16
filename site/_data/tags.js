const helpers = require('../../helpers.json');
const { toSlug } = require('../../lib/slug');

let helperData = helpers.map(helper => ({
  ...helper,
  slug: toSlug(helper.name)
}));

const tags = [
  ...helperData.reduce((acc, cur) => {
    cur.tags.forEach(tag => {
      acc.add(tag);
    });

    return acc;
  }, new Set())
]
  .map(tag => ({
    name: tag,
    title: tag,
    slug: `/${toSlug(tag)}/`,
    items: helperData.filter(helper => helper.tags.includes(tag))
  }))
  .sort((a, b) => (a.name < b.name ? -1 : 1));

module.exports = function() {
  const homeTag = {
    name: 'All',
    title: 'Home',
    slug: '/',
    items: helperData
  };

  return [homeTag, ...tags];
};
