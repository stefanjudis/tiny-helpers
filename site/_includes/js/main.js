const mql = window.matchMedia('(max-width: 55em)');
const toggleMenuButton = document.querySelector('[data-menu-button]');
const menu = document.querySelector('[data-menu]');
let menuInitialized = false;

mql.addListener(event => {
  if (!menuInitialized && event.matches) {
    initMenuToggle();
  }

  if (event.matches) {
    menu.hidden = true;
  } else {
    menu.hidden = false;
  }
});

if (mql.matches) {
  initMenuToggle();
  menu.hidden = true;
}

function initMenuToggle() {
  toggleMenuButton.setAttribute('aria-expanded', false);
  toggleMenuButton.setAttribute('aria-controls', 'menu');

  toggleMenuButton.addEventListener('click', function() {
    if (mql.matches) {
      let expanded = this.getAttribute('aria-expanded') === 'true' || false;
      this.setAttribute('aria-expanded', !expanded);
      toggleMenuButton.classList.toggle('is-active');
      menu.hidden = !menu.hidden;
    }
  });

  menuInitialized = true;
}
