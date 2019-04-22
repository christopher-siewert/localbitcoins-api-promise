const CryptoJS = require("crypto-js")
const rp = require('request-promise')
const querystring = require("querystring")
const { URL } = require('url')

class LocalBitcoins
{
  // Constructor function creates object with user's key and secret
  // as well as static variable baseURL
  constructor(key = "", secret = "") {
    this.key = key
    this.secret = secret
    this.baseURL = "https://localbitcoins.com"
  }

  // Makes a call to /api/ad-get/ to fetch info of a particular ad based on ID
  async getAdData(adNumber)
  {
    const nonce = String(Date.now())
    const endpoint = "/api/ad-get/" + adNumber + "/"
    const params = ""
    const message = nonce + this.key + endpoint + params
    const signature = CryptoJS.HmacSHA256(message, this.secret).toString(CryptoJS.enc.Hex)

    const options = {
      url: this.baseURL + endpoint,
      method: 'get',
      json: true,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded charset=utf-8',
        'Apiauth-Key': this.key,
        'Apiauth-Nonce': nonce,
        'Apiauth-Signature': signature
      }
    }
    return await rp(options)
  }

  // this function takes an adData object and posts it too the api for the adNumber
  // easiest way to create an adData object is to call getAdData for an ad and keep the
  // fields you need.
  async setAdData(adNumber, adData)
  {
    const nonce = String(Date.now())
    const endpoint = "/api/ad/" + adNumber + "/"
    const params = querystring.stringify(adData)
    const message = nonce + this.key + endpoint + params
    const signature = CryptoJS.HmacSHA256(message, this.secret).toString(CryptoJS.enc.Hex)

    const options = {
      url: this.baseURL + endpoint,
      method: 'post',
      body: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded charset=utf-8',
        'Apiauth-Key': this.key,
        'Apiauth-Nonce': nonce,
        'Apiauth-Signature': signature
      }
    }
    return await rp(options)
  }

  // This checks your localbitcoins balance
  // response.data.total.sendable is your sendable balance
  async checkBalance()
  {
    const nonce = String(Date.now())
    const endpoint = "/api/wallet-balance/"
    const params = ""
    const message = nonce + this.key + endpoint + params
    const signature = CryptoJS.HmacSHA256(message, this.secret).toString(CryptoJS.enc.Hex)

    const options = {
      url: this.baseURL + endpoint,
      method: 'get',
      body: params,
      json: true,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded charset=utf-8',
        'Apiauth-Key': this.key,
        'Apiauth-Nonce': nonce,
        'Apiauth-Signature': signature,
      }
    }
    return await rp(options)
  }

  // This sends bitcoins from your localbitcoins wallet to an external wallet address
  async sendBitcoins(address, amount)
  {
    var nonce = String(Date.now())
    var endpoint = "/api/wallet-send/"
    var params = querystring.stringify({"address": address, "amount": amount})
    var message = nonce + this.key + endpoint + params
    var signature = CryptoJS.HmacSHA256(message, this.secret).toString(CryptoJS.enc.Hex)

    var options = {
      url: this.baseURL + endpoint,
      method: 'post',
      body: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded charset=utf-8',
        'Apiauth-Key': this.key,
        'Apiauth-Nonce': nonce,
        'Apiauth-Signature': signature,
      }
    }

    return await rp(options)
  }

  // This returns an array with only your unpaid trades
  async getUnpaidTrades()
  {
    const nonce = String(Date.now())
    const endpoint = "/api/dashboard/"
    const params = ""
    const message = nonce + this.key + endpoint + params
    const signature = CryptoJS.HmacSHA256(message, this.secret).toString(CryptoJS.enc.Hex)
    const options = {
      url: this.baseURL + endpoint,
      method: 'get',
      json: true,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded charset=utf-8',
        'Apiauth-Key': this.key,
        'Apiauth-Nonce': nonce,
        'Apiauth-Signature': signature,
      }
    }
    const response = await rp(options)
    let unPaidAds = []
    if (response.data.contact_count != 0){
      for(let i = 0; i < response.data.contact_list.length; i++) {
        if (response.data.contact_list[i].data.payment_completed_at == null) {
          unPaidAds.push(response.data.contact_list[i])
        }
      }
    }
    return unPaidAds
  }

  // This takes a trade object, as returned by one of the indeces of getUnpaidTrades() and
  // marks it as paid
  async markPaid(trade)
  {
      let fullUrl = new URL(trade.actions.mark_as_paid_url)
      let nonce = String(Date.now())
      let endpoint = fullUrl.pathname
      let params = ""
      let message = nonce + this.key + endpoint + params
      let signature = CryptoJS.HmacSHA256(message, this.secret).toString(CryptoJS.enc.Hex)
      let options = {
        url: fullUrl.href,
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded charset=utf-8',
          'Apiauth-Key': this.key,
          'Apiauth-Nonce': nonce,
          'Apiauth-Signature': signature,
        }
      }
      return await rp(options)
    }

  // This takes a trade object as returned by one of the indeces of getUnpaidTrades() and
  // sends them a message
  async sendMessage(trade, message)
  {
    fullUrl = new URL(contact.actions.message_post_url)
    nonce = String(Date.now())
    endpoint = fullUrl.pathname
    params = querystring.stringify({"msg": message})
    message = nonce + this.key + endpoint + params
    signature = CryptoJS.HmacSHA256(message, this.secret).toString(CryptoJS.enc.Hex)
    options = {
      url: fullUrl.href,
      method: 'post',
      body: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded charset=utf-8',
        'Apiauth-Key': this.key,
        'Apiauth-Nonce': nonce,
        'Apiauth-Signature': signature,
      }
    }
    return await rp(options)
  }
}

module.exports = LocalBitcoins
