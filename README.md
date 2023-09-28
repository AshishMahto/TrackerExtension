# TrackerExtension

An Egde / Chromium browser extension.

### Premise
On the 'Matches' tab, Tracker.gg will display stats current Episode by default, even when `All` or the current Act is selected. 

All that this extension does is replace both those behaviours with displaying stats for the current Act instead.

### Implementation
```js
function overrideAggregated(TrnModule) {
  // the current season
  const { defaultSeason } = window.__INITIAL_STATE__.stats.standardProfiles[0].metadata;

  // find the correct export
  const [ TrnAcquaintances ] = Object.entries(TrnModule).find(([, { name }]) => name === "TrnAcquaintances");

  // save the old fetch function
  const { fetchAggregated } = TrnModule[TrnAcquaintances].methods;

  // replace the fetch function
  TrnModule[TrnAcquaintances].methods.fetchAggregated = async function () {
    // add the missing Act ID
    this.filter.seasonId = this.filter.seasonId ?? defaultSeason;

    // call the old fetch function again
    return fetchAggregated.apply(this, arguments);
  };
};
```
