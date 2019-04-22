# LocalBitcoins API

This is an asynchronous Node.js LocalBitcoins API wrapper for a few of the API endpoints. I wanted to do some programmatic trading on LocalBitcoins and just started writing functions before I realized other API wrappers already existed.

I only added support for a few of the API endpoints, just what I specifically required. If you need a complete wrapper I suggest going with [localbitcoins-client](https://www.npmjs.com/package/localbitcoins-client) instead.

It will also help to read more about the [LocalBitcoins API](https://localbitcoins.com/api-docs/).

### Usage
```
npm install localbitcoins-api-promise
```

Then import the package, and create a new LocalBitcoins object with your API key and secret:

```javascript
const LocalBitcoins = require('localbitcoins-api-promise')
let LBC = new LocalBitcoins(key, secret)

 // Example, will return your wallet balance data
let response = await LBC.checkBalance()
```

#### LocalBitcoins Object Member Functions

`getAdData(adNumber)`
- Input: the ID number of an ad
- Output: the LocalBitcoins server response containing the data from an ad with ID `number`

`setAdData(adNumber, adData)`
- Input: an object containing the ad data, and an ID for the ad you want to update
 - I recommend calling `getAdData()` on the ad you want to update, editing the data fields, and then posting that object.
- Output: the LocalBitcoins server response from the update call

`checkBalance()`
- Input: none
- Output: the LocalBitcoins server response containing info about your wallet balance.
 - `response.data.total.sendable` is your spendable balance.

`sendBitcoins(address, amount)`
- Input: a bitcoin address to send money to, and an amount to send
- Output: the LocalBitcoins server response

`getUnpaidTrades()`
- Input: none
- Output: a processed array of trade objects that have not been paid yet.

`markPaid(trade)`
- Input: a trade object (like the one returned by `getUnpaidTrades`)
- Output: the LocalBitcoins server response

`sendMessage(trade, message)`
- Input: a trade object (like the one returned by `getUnpaidTrades`) and a string message to send to the person you are in the trade with.
- Output: the LocalBitcoins server response
