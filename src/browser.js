import { html } from 'htm/preact';
import { render } from 'preact';
import { App } from './components/App.js';

export function renderApp({ tag }) {
  const { helpers, tags } = JSON.parse(
    document.getElementById('data').innerHTML
  );
  return render(
    html`
      <${App} currentTag=${tag} helpers=${helpers} tags=${tags} />
    `,
    document.querySelector('#app')
  );
}
