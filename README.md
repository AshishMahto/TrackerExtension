# TrackerExtension

An Edge / Chromium browser extension.

### What does it do?
On the 'Matches' tab, Tracker.gg will display SoloQ / DuoQ+ stats for the last 60 days,
even when `All` or the current Act tab is selected.

All that this extension does is replace the behaviour by instead displaying teammate stats for the current Act.

There may be a bug with a race condition between the API call and replacing the function, 
it's possible that on initial load, Tracker will continue to show the stats of the current Episode.
<br>
Simply switching the Act back and forth should fix this, and show the stats for the current Act.

### Implementation

Essentially, the Tracker.gg code has a bug:
```js
computed = {
  // ...,
  currentSeasonFilter() {
    return {
      ...this.filter,
      seasonId: this.filter.seasonId === this.currentSeason.id ? null : this.filter.seasonId
    }
  },
  // ...
}
```
It `null`s out the seasonId, assuming that `null` means 'use the current Act'.
<br>
However, this is not the case; the Acquaintances API (which calculates SoloQ / PartyQ games)
assumes that `null` means 'use the last 60 days'.

So the fix is as simple as replacing the function:
```js
computed.currentSeasonFilter = function () { return this.filter };
```

Looking at the existing Tracker.gg code, 
I believe it's an artefact of an older version that didn't support `seasonId` for the current Act.
After taking a quick look through some `season` stores, it seems that at the time, `seasonId` is fully supported 
for all acts including the current Act. 
<br>
<b> 
    However, it is possible that there are some old calculations that rely on a missing `seasonId`.
    If you see any bugs related to incorrect Act stats being shown while using my extension, please report them in [issues](https://github.com/AshishMahto/TrackerExtension/issues).
</b>
