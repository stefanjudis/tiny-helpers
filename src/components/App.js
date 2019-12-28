import { html } from 'htm/preact';
import { useEffect, useState } from 'preact/hooks';

function updateHistory({ tag }) {
  history.replaceState({}, document.title, `?tag=${tag}`);
}

export function App({ helpers, tags, currentTag = 'All' }) {
  console.log(currentTag);
  const filterHelpers = (helpers, activeTag) =>
    activeTag === 'All'
      ? helpers
      : helpers.filter(helper => helper.tags.includes(activeTag));
  const [activeTag, setActiveTag] = useState(currentTag);
  const [activeHelpers, setActiveHelpers] = useState(
    filterHelpers(helpers, activeTag)
  );

  useEffect(() => {
    console.log(activeTag);
    setActiveHelpers(filterHelpers(helpers, activeTag));
    updateHistory({ tag: activeTag });
  }, [activeTag]);

  return html`
    <div>
      <h1>Tiny helpers</h1>
      <div class="container">
        <aside>
          <ol>
            <li>
              <button onClick=${() => setActiveTag('All')} type="button">
                All
              </button>
            </li>
            ${tags.map(
              tag =>
                html`
                  <li>
                    <button onClick=${() => setActiveTag(tag)} type="button">
                      ${tag}
                    </button>
                  </li>
                `
            )}
          </ol>
        </aside>
        <main>
          <ul class="helper-grid">
            ${activeHelpers.map(
              ({ slug }) =>
                html`
                  <li><img src="/static/screenshots/${slug}.jpg" /></li>
                `
            )}
          </ul>
        </main>
      </div>
    </div>
  `;
}
