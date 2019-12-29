import { html } from 'htm/preact';
import { useEffect, useState } from 'preact/hooks';

function updateHistory({ tag }) {
  // todo fix the back button
  history.pushState({}, document.title, `/${tag === 'all' ? '' : tag}`);
}

export function App({ helpers, tags, currentTag }) {
  const filterHelpers = (helpers, activeTag) =>
    activeTag === 'all'
      ? helpers
      : helpers.filter(helper => helper.tagSlugs.includes(activeTag));
  const [activeTag, setActiveTag] = useState(currentTag);
  const [activeHelpers, setActiveHelpers] = useState(
    filterHelpers(helpers, activeTag)
  );

  useEffect(() => {
    setActiveHelpers(filterHelpers(helpers, activeTag));
    updateHistory({ tag: activeTag });
  }, [activeTag]);

  return html`
    <div class="container">
      <div class="sidebar">
        <div class="sidebar__header">
          <h1>Tiny helpers</h1>
        </div>
        <div class="topbar">
          something
        </div>
        <div class="sidebar__body">
          <p>
            A collection of single-purposed online tools for web development
          </p>
          <ol class="sidebar__tags u-marginBottomLarge">
            <li class="sidebar__tag">
              <a
                href="/"
                class="${'all' === activeTag ? 'isActive' : ''}"
                onClick=${event => {
                  event.preventDefault();
                  setActiveTag('all');
                }}
                type="button"
                >All
              </a>
              <div class="sidebar__tagCount">${helpers.length}</div>
            </li>
            ${tags.map(
              tag =>
                html`
                  <li class="sidebar__tag">
                    <a
                      href="/${tag.slug}"
                      class="${tag.slug === activeTag ? 'isActive' : ''}"
                      onClick=${event => {
                        event.preventDefault();
                        setActiveTag(tag.slug);
                      }}
                      type="button"
                    >
                      ${tag.name}
                    </a>
                    <div class="sidebar__tagCount">${tag.count}</div>
                  </li>
                `
            )}
          </ol>
          <a
            class="btn--cta"
            href="https://github.com/stefanjudis/tiny-helpers#contributing"
            >Add helper
            <svg
              width="100"
              height="100"
              viewBox="0 0 100 100"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="m82.102 58h-24.102v24.102c0 4.3984-3.6016 8-8 8s-8-3.6016-8-8v-24.102h-24.102c-4.3984 0-8-3.6016-8-8s3.6016-8 8-8h24.102v-24.102c0-4.3984 3.6016-8 8-8s8 3.6016 8 8v24.102h24.102c4.3984 0 8 3.6016 8 8s-3.6016 8-8 8z"
                fill-rule="evenodd"
              />
            </svg>
          </a>
        </div>
      </div>
      <main class="canvas">
        <div class="canvas__body">
          ${activeHelpers.length
            ? html`
                <ul class="helper-grid">
                  ${activeHelpers.map(
                    ({ desc, maintainers, name, slug }) =>
                      html`
                        <li class="helper-grid__item">
                          <img
                            class="u-marginBottomMedium"
                            src="/static/screenshots/${slug}.jpg"
                            loading="lazy"
                          />
                          <h3>${name}</h3>
                          <p>${desc}</p>

                          <ul>
                            ${maintainers.map(
                              maintainer =>
                                html`
                                  <img
                                    class="maintainer"
                                    srcset="
                                      https://github.com/${maintainer}.png?size=40 1x,
                                      https://github.com/${maintainer}.png?size=80 2x
                                    "
                                    src="https://github.com/${maintainer}.png"
                                    loading="lazy"
                                  />
                                `
                            )}
                          </ul>
                        </li>
                      `
                  )}
                </ul>
              `
            : html`
                That's no valid tag or?
              `}
        </div>
      </main>
    </div>
  `;
}
