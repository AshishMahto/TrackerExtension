
/**
 * Replace the `fetchAggregated` function in the module with a version that fixes the missing parameter bug.
 * @param acquaintanceMethods An object that contains helpers that call teammate related Tracker.gg APIs.
 */
function overrideAggregated(acquaintanceMethods) {
  const { defaultSeason } = window.__INITIAL_STATE__.stats.standardProfiles[0].metadata;
  const { fetchAggregated } = acquaintanceMethods;
  acquaintanceMethods.fetchAggregated = async function () {
    this.filter.seasonId = this.filter.seasonId ?? defaultSeason;
    return fetchAggregated.apply(this, arguments);
  };
}

/**
 * Find the module responsible for valorant routes in index.js, and send it to `overrideAggregated`
 * @require Assumes the modules' `link` positions are relatively static over Tracker site updates.
 */
function main() {
  const indexJs = document.querySelector('script[type="module"]').src;
  fetch(indexJs)
    .then((r) => r.text())
    .then((source) => {
      const i = source.indexOf("/valorant/config/routes.js");
      const a = source.indexOf("./", i);
      const b = source.indexOf(".js", a);
      const jsFile = indexJs.replace(/index[\w.]*js/, source.slice(a + 2, b + 3));
      import(jsFile).then((RouterModule) => RouterModule.default()
        .flatMap((x) => x.children ?? [])
        .find(({path}) => path === "matches")
        .component()
        .then((TrnModule) => overrideAggregated(TrnModule.default.components.Acquaintances.methods))
      )
    });
}

// run it at the next available event loop, so that DOM elements are available
setTimeout(main, 0);
