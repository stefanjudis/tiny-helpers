const Feed = require('feed').Feed;
const { description } = require('../package.json');
const { getHelpers } = require('../lib/helpers');
const { writeFile } = require('fs').promises;
const { join } = require('path');
const { toSlug } = require('../lib/slug');

(async () => {
  const helpers = await getHelpers();
  try {
    const rssFeed = new Feed({
      title: 'Tiny Helpers',
      description,
      id: 'https://tiny-helpers.dev/',
      link: 'https://tiny-helpers.dev/',
      language: 'en',
      image: 'http://example.com/image.png',
      favicon: 'https://tiny-helpers.dev/favicon.ico',
      copyright: `All rights reserved ${new Date().getUTCFullYear()}, Stefan Judis`,
      generator: 'Feed for tiny-helpers.dev', // optional, default = 'Feed for Node.js'
      feedLinks: {
        atom: 'https://tiny-helpers.dev/feed.atom',
        rss: 'https://tiny-helpers.dev/feed.xml'
      },
      author: {
        name: 'Stefan Judis',
        email: 'stefanjudis@gmail.com',
        link: 'https://www.stefanjudis.com'
      }
    });

    const searchItems = [];

    helpers
      .sort((a, b) => (new Date(a.addedAt) < new Date(b.addedAt) ? 1 : -1))
      .forEach(({ addedAt, name, desc, url }) => {

        rssFeed.addItem({
          title: `New helper added: ${name} – ${desc}.`,
          id: toSlug(name),
          link: url,
          description: desc,
          content: `More tools! 🎉🎉🎉 "${name}" is available at ${url}`,
          date: new Date(addedAt),
          image: `https://tiny-helpers.dev/screenshots/${toSlug(name)}@1.jpg`
        });

        // Lowercase the properties for search so it's safe to just match on lowercase
        searchItems.push({
          id: toSlug(name),
          name: name.toLowerCase(),
          desc: desc.toLowerCase(),
        });
      });

    console.log('Writing rss feed');
    await writeFile(join('.', 'static', 'feed.xml'), rssFeed.rss2());

    console.log('Writing search data');
    await writeFile(join('.', 'static', 'searchData.json'), JSON.stringify(searchItems), 'utf8');

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
