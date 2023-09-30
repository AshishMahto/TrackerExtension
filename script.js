
/** Essentially a Tracker.gg bugfix */
fixSeasonFilter = (TrnModule) => TrnModule.default.computed.currentSeasonFilter = function () { return this.filter };

/**
 * Find the module responsible for valorant routes, and send it to `fixSeasonFilter`
 * @require Assumes the modules' `link` positions are relatively static over Tracker site updates.
 */
function main() {
  const links = document.head.querySelectorAll('link[rel="modulepreload"]');
  if (!links) return;
  import(links[6].href).then(fixSeasonFilter);
  document.head.removeEventListener('DOMNodeInserted', main);
}

// run it at the next available event loop, so that DOM elements are available
setTimeout(() => document.head.addEventListener('DOMNodeInserted', main), 0)
