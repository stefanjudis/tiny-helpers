import { html } from 'htm/preact';
import render from 'preact-render-to-string';
import { App } from './components/App.js';
import helperData from '../data/helpers.json';

export function renderApp({}) {
  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css?family=Comfortaa:700&display=swap&text=CSS%20Scroll%20Shadows!" rel="stylesheet">
        <style></style>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>CSS scroll shadows</title>
        <script type="module">
          import {renderApp} from './static/bundle.js';
          renderApp({});
        </script>
      </head>
      <body>
        <main>${render(
          html`
            <${App} helpers=${helperData} />
          `
        )}</main>
        <script id="data" type="application/json">${JSON.stringify(
          helperData
        )}</script>
      </body>
      </html>
    `;
}
