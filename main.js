const {get} = require('request-promise-native');

//paskutinis parametras nurodo kiek kartu padaryti uzklausa, nenurodzius daro begalybe kartu arba kol
//pagauna klaida
function getEvery(uri, ms, times = Infinity) {
  let counter = 0, retry = 0;
  let options = {
    method: 'GET',
    uri,
    resolveWithFullResponse: true
  };

  const resolve = response => {
    console.log(`Bitcoin price $${JSON.parse(response.body)["last_price"]}`);
    retry = 0;
    counter++;
    if (counter < times) {
      setTimeout(() => { get(options).then(resolve, reject) }, ms);
    }
  };

  const reject = error => {
    console.log(`Something went wrong, status code : ${error.statusCode}`);

    if (retry < 5) {
      console.log(`Retrying request, attempt : ${++retry}`);
      get(options).then(resolve, reject);
    } else {
      console.log(`Failed to receive a response after ${retry} tries... Aborting connection`);
    }
  };

  return () => {get(options).then(resolve, reject); };
}

//siuncia requesta kas 10 sekundziu 5 kartus.
const getEvery10 = getEvery('https://api.bitfinex.com/v1/pubticker/btcusd', 10 * 1000, 5);
getEvery10();
