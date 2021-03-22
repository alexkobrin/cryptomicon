
const API_KEY = '377087d45447a91872a1cc2ad293c1f93b97521889b47b12ed3c795df79476a8'
 
const tickersHandlers = new Map() // {}
 const socket = new WebSocket(`wss://streamer.cryptocompare.com/v2&?api_key=${API_KEY}`)
 const AGGREGATE_INDEX = "5"
 socket.addEventListener("message", e => {
   const {TYPE: type , FROMSYMBOL: currency , PRICE: newPrice} = JSON.parse(e.data)
  // Из многих сообщений оствляем только то что нужно
   if (type !== AGGREGATE_INDEX || newPrice === undefined ) {
    return;
  }
  const handlers =  tickersHandlers.get(currency) ?? [];
  handlers.forEach(fn => fn(newPrice))

 })
  const sendToWebSoket = (message) => {
    const stringifyMessage = JSON.stringify(message)

     if (socket.readyState === WebSocket.OPEN) {
       socket.send(stringifyMessage)
       return;
     }
     socket.addEventListener("open", () => {
      socket.send(stringifyMessage)
     }, {once: true}
     )
  }

   function  subscribeToTickerOnWS(ticker)  {
    sendToWebSoket({
      "action": "SubAdd",
      "subs": [`5~CCCAGG~${ticker}~USD`]
       })
   }
     
   function  unsubscribeFromTickerOnWS(ticker)  {
    sendToWebSoket({
      "action": "SubRemove",
      "subs": [`5~CCCAGG~${ticker}~USD`]
       })
   }
     
    export const subscribeToTicker = (ticker, cb) => {
       const subscribes = tickersHandlers.get(ticker) || [] 
       tickersHandlers.set(ticker, [...subscribes , cb])
       subscribeToTickerOnWS(ticker)

     };
     export const unsubscribeFromTicker = ticker => {
       tickersHandlers.delete(ticker)
       unsubscribeFromTickerOnWS(ticker)
     }
    //  setInterval(loadTickers,5000)

     window.tickers = tickersHandlers