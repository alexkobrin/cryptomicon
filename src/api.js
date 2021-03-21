
const API_KEY = '377087d45447a91872a1cc2ad293c1f93b97521889b47b12ed3c795df79476a8'
 
const tickersHandlers = new Map() // {}

// TODO refactor to use URLSearchParams
 const  loadTickers =  () => {

   if (tickersHandlers.size === 0){
     return;
    }

 fetch(
      `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[...tickersHandlers.keys()].join(",")}&tsyms=USD&api_key=${API_KEY}`
     
    ).then(r => r.json()).then(rawData => {
      const updatedPrices =  Object.fromEntries(
      Object.entries(rawData).map(([key,value]) => [key, value.USD])
    )
    Object.entries(updatedPrices).forEach(([currency, newPrice]) => {
      const handlers =  tickersHandlers.get(currency) ?? [];
      handlers.forEach(fn => fn(newPrice))
    })
  
  })
 }

    export const subscribeToTicker = (ticker, cb) => {
       const subscribes = tickersHandlers.get(ticker) || [] 
       tickersHandlers.set(ticker, [...subscribes , cb])
     };
     export const unsubscribeFromTicker = ticker => {
       tickersHandlers.delete(ticker)
      // const subscribes = tickersHandlers.get(ticker) || [] 
      // tickersHandlers.set(ticker, subscribes.filter(fn => fn !== cb))
     }
     setInterval(loadTickers,5000)

     window.tickers = tickersHandlers