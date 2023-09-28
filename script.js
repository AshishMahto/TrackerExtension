
function overrideAggregated(TrnModule) {
  window.TrnModule = TrnModule;
  // the current season
  const { defaultSeason } = window.__INITIAL_STATE__.stats.standardProfiles[0].metadata;

  // find the correct export
  const TrnAcquaintances = Object.entries(TrnModule).find(([, { name }]) => name === "TrnAcquaintances")[0];

  // save the old fetch function
  const { fetchAggregated } = TrnModule[TrnAcquaintances].methods;

  TrnModule[TrnAcquaintances].methods.fetchAggregated = async function () {

    // add the missing Act ID
    this.filter.seasonId = this.filter.seasonId ?? defaultSeason;

    // call the old fetch function again
    return fetchAggregated.apply(this, arguments);
  };
};

function main() {
  const TrnModules = [...document.querySelectorAll('link[rel="modulepreload"]')].map((x) => x.href);
  import(TrnModules[7]).then((TrnModule) => overrideAggregated(TrnModule));
};

const script = document.createElement('script');
script.type = 'module';
script.textContent = `
import {a, A} from './51479c59.js';
console.log({a, A});
`;
document.head.appendChild(script);
