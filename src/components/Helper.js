import { html } from 'htm/preact';

export default function Helper({ helper }) {
  const { desc, name, maintainers, slug, url } = helper;
  return html`
    <div class="helper u-height-100">
      <img
        width="1000"
        height="600"
        class="helper__image"
        src="/static/screenshots/${slug}.jpg"
        alt="Screenshot of ${url}"
        loading="lazy"
      />
      <h3 class="helper__headline">
        <a href="${url}">${name}</a>
      </h3>
      <p class="helper__desc">${desc}</p>

      ${maintainers.length
        ? html`
            <div class="helper__maintainers u-marginTopAuto">
              <h4 class="u-margin-bottom-s">Made by</h4>

              <ul class="helper__maintainersList u-listReset">
                ${maintainers.map(
                  maintainer =>
                    html`
                      <li>
                        <a
                          class="helper__maintainer"
                          href="https://github.com/${maintainer}"
                        >
                          <img
                            width="40"
                            height="40"
                            srcset="
                              https://github.com/${maintainer}.png?size=40 1x,
                              https://github.com/${maintainer}.png?size=80 2x
                            "
                            src="https://github.com/${maintainer}.png"
                            alt="GitHub profile image of ${maintainer}"
                            loading="lazy"
                          />
                        </a>
                      </li>
                    `
                )}
              </ul>
            </div>
          `
        : ''}
      <a
        href="${url}"
        class="helper__btn ${!maintainers.length ? 'u-marginTopAuto' : ''}"
        >Go to <strong>${name}</strong></a
      >
    </div>
  `;
}
