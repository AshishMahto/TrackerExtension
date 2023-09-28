# TrackerExtension

An Edge / Chromium browser extension.

### What does it do?
On the 'Matches' tab, Tracker.gg will display SoloQ / DuoQ+ stats for the current Episode by default, even when `All` or the current Act is selected. 

All that this extension does is replace both those behaviours with displaying teammate stats for the current Act instead.

There's still a bug with a race condition between the API call and replacing the function, 
it's possible that on initial load, Tracker will continue to show the stats of the current Episode. 
<br>
Simply switching the Act back and forth should fix this, and show the stats for the current Act.

### Implementation
```js
/**
 * Replace the `fetchAggregated` function in the module with a version that fixes the missing parameter bug.
 * @param acquaintanceMethods An object that contains helpers that call teammate related Tracker.gg APIs.
 */
function overrideAggregated(acquaintanceMethods) {
  // the current season
  const { defaultSeason } = window.__INITIAL_STATE__.stats.standardProfiles[0].metadata;

  // save the old fetch function
  const { fetchAggregated } = acquaintanceMethods;

  // replace the fetch function
  acquaintanceMethods.fetchAggregated = async function () {
    // add the missing Act ID
    this.filter.seasonId = this.filter.seasonId ?? defaultSeason;

    // call the old fetch function again
    return fetchAggregated.apply(this, arguments);
  };
}
```
