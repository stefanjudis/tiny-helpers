import { html } from 'htm/preact';
import { useEffect, useState } from 'preact/hooks';

function updateHistory({ tag }) {
  history.replaceState({}, document.title, `?tag=${tag}`);
}

export function App({ helpers, tags, currentTag }) {
  console.log(currentTag);
  const filterHelpers = (helpers, activeTag) =>
    activeTag === 'All'
      ? helpers
      : helpers.filter(helper => helper.tagSlugs.includes(activeTag));
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
      <header>
        <h1>Tiny helpers</h1>
      </header>
      <div class="container">
        <aside class="sidebar">
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
                    <button
                      onClick=${() => setActiveTag(tag.slug)}
                      type="button"
                    >
                      ${tag.name}
                    </button>
                  </li>
                `
            )}
          </ol>
        </aside>
        <main class="canvas">
          <ul class="helper-grid">
            ${activeHelpers.map(
              ({ desc, maintainers, name, slug }) =>
                html`
                  <li class="helper-grid__item">
                    <h3>${name}</h3>
                    <img src="/static/screenshots/${slug}.jpg" />
                    <p>${desc}</p>

                    <ul>
                      ${maintainers.map(
                        maintainer =>
                          html`
                            <img
                              class="maintainer"
                              src="https://github.com/${maintainer}.png"
                            />
                          `
                      )}
                    </ul>
                  </li>
                `
            )}
          </ul>
        </main>
      </div>
    </div>
  `;
}
