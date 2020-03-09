// This JavaScript is bundled together with the variable 'searchItems' from the
// file 'static/searchData.json'. This variable is an array and contains items with
// 'name' and 'desc' properties that are lowercase.
{
  const helpers = searchItems;

  // Get the search term from the querystring
  const urlParams = new URLSearchParams(window.location.search);
  const hasSearchTerm = urlParams.has('q');
  const querySearchTerm = hasSearchTerm ? urlParams.get('q').toLowerCase() : null;

  const searchElement = document.getElementById('search');

  // If no search input then not showing all items / filtering by tag so do nothing
  if (searchElement) {
    // Add the search input event listener with debounced handler and set value
    const debounceSearchFunc = debounce(filterItems, 250);
    searchElement.addEventListener('keydown', debounceSearchFunc);
    searchElement.value = querySearchTerm;

    // If there is a querystring search term then perform the initial filter
    if (querySearchTerm) {
      filterItems();
    }
  }

  // Unhide the helpers list
  const helpersList = document.getElementById('helpers-list');
  helpersList.classList.remove('js-helpers-hidden');

  function filterItems() {
    const searchTerm = searchElement.value.toLowerCase();

    console.time('Filtering helpers');

    helpers.forEach(helper => {
      const element = document.getElementById(helper.id);
      const match = !searchTerm || helper.name.includes(searchTerm) || helper.desc.includes(searchTerm);

      if (!match) {
        element.style.display = 'none';
      } else {
        element.style.display = 'flex';
      }
    });

    console.timeEnd('Filtering helpers');
  }

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  function debounce(func, wait, immediate) {
    let timeout;

    return function executedFunction() {
      const context = this;
      const args = arguments;

      const later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };

      const callNow = immediate && !timeout;

      clearTimeout(timeout);

      timeout = setTimeout(later, wait);

      if (callNow) func.apply(context, args);
    };
  }
}
