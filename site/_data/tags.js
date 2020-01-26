const { toSlug } = require('../../lib/slug');
const { getHelpers, getTags } = require('../../lib/helpers');

module.exports = async function() {
  const helperData = (await getHelpers()).map(helper => ({
    ...helper,
    slug: toSlug(helper.name)
  }));

  const tags = getTags(helperData).map(tag => ({
    name: tag,
    title: tag,
    slug: `${toSlug(tag)}`,
    items: helperData.filter(helper => helper.tags.includes(tag))
  }))
    .sort((a, b) => (a.name < b.name ? -1 : 1));

  const homeTag = {
    name: 'All',
    title: 'Home',
    slug: 'home',
    items: helperData
  };

  return [homeTag, ...tags];
};
