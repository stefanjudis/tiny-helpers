import { html } from 'htm/preact';

function updateHistory({ bgColor, shadowColor, pxSize }) {
  history.replaceState(
    {},
    document.title,
    `?bgColor=${bgColor.replace('#', '')}&shadowColor=${shadowColor.replace(
      '#',
      ''
    )}&pxSize=${pxSize}`
  );
}

export function App({ helpers }) {
  return html`
    <div class="container">
      <img src="/static/screenshots/shadows.jpg" />
      ${helpers.length}
    </div>
  `;
}
