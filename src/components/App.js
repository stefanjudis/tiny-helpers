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
          <a
            class="btn btn--ghost"
            href="https://github.com/stefanjudis/tiny-helpers#contributing"
            >Follow on Twitter

            <svg
              focusable="false"
              width="100pt"
              height="100pt"
              viewBox="0 0 100 100"
            >
              <path
                d="m58.637 19.746l-0.019531-0.007813-0.17969 0.25c-0.33594 0.41406-0.64062 0.84375-0.91797 1.2852l-10.844 15.156-16.512-11.812-14.164-10.086v29.809h0.003906c-0.066406 4.0273 1.4375 8.0742 4.5078 11.148 2.6172 2.6133 5.9375 4.0938 9.3555 4.4336l-2.3594 3.293-15.508 21.785h45.84l0.003906-0.003906c6.1914 0.10156 12.414-2.2109 17.141-6.9375 4.1172-4.1172 6.4023-9.3789 6.8555-14.762l0.085937-0.050781v-1.918-0.046875-24.383l8.6055-4.6094-8.6211-4.6211c-0.14844-3.1719-1.4297-6.3008-3.8555-8.7227-5.1562-5.1602-13.52-5.1602-18.68 0-0.25781 0.25781-0.50391 0.52734-0.73828 0.80078zm12.816 4.7227c1.0508 1.0508 1.0508 2.7539 0 3.8047-1.0469 1.0508-2.75 1.0508-3.8008 0-1.0508-1.0508-1.0508-2.7539 0-3.8047 1.0508-1.0508 2.7539-1.0508 3.8008 0"
              />
            </svg>
          </a>

          <a
            class="btn btn--ghost"
            href="https://github.com/stefanjudis/tiny-helpers#contributing"
            >Check RSS
            <svg
              focusable="false"
              width="100pt"
              height="100pt"
              viewBox="0 0 100 100"
            >
              <path
                d="m0 0v25c41.625 0 75 33.375 75 75h25c0-55.125-44.875-100-100-100zm0 37.5v25c20.875 0 37.5 16.625 37.5 37.5h25c0-34.375-28.125-62.5-62.5-62.5zm0 37.5v25h25c0-13.875-11.25-25-25-25z"
              />
            </svg>
          </a>

          <a
            class="btn btn--cta"
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
        <div class="sidebar__body">
          <p class="sidebar__explainer">
            A collection of single-purpose online tools for web developers...
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
                    >
                      ${tag.name}
                    </a>
                    <div class="sidebar__tagCount">${tag.count}</div>
                  </li>
                `
            )}
          </ol>
          <div class="sidebar__broughtToYou">
            Brought to you by
            <a href="https://twitter.com/stefanjudis">Stefan Judis</a>
          </div>
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
                            width="1000"
                            height="600"
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
                                    width="40"
                                    height="40"
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
