
/** Essentially a Tracker.gg bugfix */
fixSeasonFilter = (TrnModule) => TrnModule.default.computed.currentSeasonFilter = function () { return this.filter }

/** Find the module responsible for valorant routes in index.js, and send it to `fixSeasonFilter` */
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
        .then(fixSeasonFilter)
      )
    });
}

// run it at the next available event loop, so that DOM elements are available
setTimeout(main, 0);
