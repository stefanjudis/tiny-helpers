import { html } from 'htm/preact';
import { render } from 'preact';
import { App } from './components/App.js';

export function renderApp({}) {
  console.log(JSON.parse(document.getElementById('data').innerHTML));
  return render(
    html`
      <${App}
        helpers=${JSON.parse(document.getElementById('data').innerHTML)}
      />
    `,
    document.querySelector('main')
  );
}
