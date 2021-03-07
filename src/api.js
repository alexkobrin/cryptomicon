
const API_KEY = '377087d45447a91872a1cc2ad293c1f93b97521889b47b12ed3c795df79476a8'
 
// TODO refactor to use URLSearchParams
export  const  loadTicker = tickers => {
 fetch(
      `https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=${tickers.join(',')}&api_key=${API_KEY}`
    ).then(r => r.json())
}