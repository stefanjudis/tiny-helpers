import { html } from 'htm/preact';
import { render } from 'preact';
import { App } from './components/App.js';

// only has to be imported – it will work on its own
import focusVisible from 'focus-visible';

export function renderApp({ tag }) {
  const { helpers, tags } = JSON.parse(
    document.getElementById('data').innerHTML
  );

  // TODO
  window.onpopstate = function(event) {
    console.log(document.location);
  };

  return render(
    html`
      <${App} currentTag=${tag} helpers=${helpers} tags=${tags} />
    `,
    document.querySelector('#app')
  );
}
