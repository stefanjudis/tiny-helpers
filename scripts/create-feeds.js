const Feed = require('feed').Feed;
const { description } = require('../package.json');
const helpers = require('../data/helpers.json');
const slugify = require('slugify');
const { writeFile } = require('fs').promises;
const { join } = require('path');

const toSlug = name => slugify(name).toLocaleLowerCase();

(async () => {
  try {
    const feed = new Feed({
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

    helpers
      .sort((a, b) => (new Date(a.addedAt) < new Date(b.addedAt) ? 1 : -1))
      .forEach(({ addedAt, name, desc, url }) => {
        feed.addItem({
          title: `New helper added to tiny-helpers.dev: ${name}`,
          id: toSlug(name),
          link: url,
          description: desc,
          content: `More tools! :) "${name}" is available at ${url}`,
          date: new Date(addedAt)
        });
      });

    console.log('Writing rss feed');
    writeFile(join('.', 'static', 'feed.xml'), feed.rss2());
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
