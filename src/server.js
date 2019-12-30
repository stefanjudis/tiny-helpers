import { html } from 'htm/preact';
import render from 'preact-render-to-string';
import { App } from './components/App.js';
import helperData from '../data/helpers.json';
import slugify from 'slugify';

// todo put this into utils
const toSlug = name => slugify(name).toLocaleLowerCase();

const helpers = helperData.map(helper => ({
  slug: toSlug(helper.name),
  tagSlugs: helper.tags.map(toSlug),
  ...helper
}));

const tags = [
  ...helperData.reduce((acc, cur) => {
    cur.tags.forEach(tag => {
      const value = acc.get(tag);
      if (!value) {
        acc.set(tag, { name: tag, count: 1 });
      } else {
        acc.set(tag, { name: tag, count: ++value.count });
      }
    });

    return acc;
  }, new Map())
]
  .map(([, tag]) => ({ ...tag, slug: toSlug(tag.name) }))
  .sort((a, b) => (a.name < b.name ? -1 : 1));

export function renderApp({ css, tag = 'all' }) {
  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <!-- fix the font handling -->
        <link href="https://fonts.googleapis.com/css?family=Exo:600&display=swap" rel="stylesheet">
        <style>${css}</style>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Tiny Helpers – A collection of useful online development tools</title>
        <script type="module">
          import {renderApp} from './static/bundle.js';
          renderApp({ tag: '${tag}' });
        </script>
      </head>
      <body>
        <div id="app">${render(
          html`
            <${App} currentTag=${tag} helpers=${helpers} tags=${tags} />
          `
        )}</div>
        <script id="data" type="application/json">${JSON.stringify({
          helpers,
          tags
        })}</script>
      </body>
      </html>
    `;
}
