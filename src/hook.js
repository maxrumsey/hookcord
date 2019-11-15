const util = require('./util');
/**
 * Class used for sending Webhooks.
 * @example
 * var Hook = require('hookcord').Hook;
 * var myWebhook = new Hook;
 * myWebhook.login('Top', 'Secret');
 * myWebhook.setPayload(myPayload);
 * myWebhook.fire()
 *     .then(function(res) {
 *         console.log('Webhook sent!');
 *     })
 *     .catch(function(e) {
 *         throw e;
 *     })
 */
class Hook {
  constructor() {
    this.opts = {};
  };
  /**
   * Sets options used by the Webhook.
   * @param {WebhookOptions} Options Options that the Webhook is initialised with.
   */
  setOptions(opts) {
    if (!opts) return;
    this.opts = opts;
    if (opts.link) {
      this.link = opts.link;
      this.endpoint = this.link;
    }
    this.handler = opts.handler;
    return this;
  }
  /**
   * Sets the payload sent to the endpoint.
   * @param {WebhookJSON} Payload The Webhook to be sent to the endpoint.
   */
  setPayload(payload) {
    this.payload = payload;
    return this;
  }
  /**
   * Sets a custom link that the Webhook will be sent to. Use {@link Hook#login} if using a Discord Webhook.
   * @param {string} Link
   */
  setLink(link) {
    this.endpoint = link;
    return this;
  }
  /**
   * Creates the endpoint the Webhook will be sent to.
   * @param {string} ID The ID of the Webhook.
   * @param {string} Secret The Webhook's Secret.
   */
  login(username, secret) {
    this.endpoint = `https://discordapp.com/api/webhooks/${username}/${secret}`;
    return this;
  }
  /**
   * Sends the Webhook to the endpoint.
   */
  async fire() {
    if (!this.endpoint) throw new Error('Endpoint has not been provided.');
    if (!this.payload) throw new Error('Payload has not been provided.');
    const snekfetch = require('snekfetch');
    var res, _utiloutput;
    try {
      res = await snekfetch.post(this.endpoint)
        .send(this.payload);
    } catch (e) {
      res = e;
      if (this.opts._statcode) {
        res.statusCode = this.opts._statcode;
      }
      if (res.statusCode !== 429) {
        throw e;
      }
    }
    if (this.opts._statcode) {
      res.statusCode = this.opts._statcode;
    }
    if (res.statusCode === 429) {
      _utiloutput = util.handleRatelimit(this.opts.handler, res);
    }
    res._utiloutput = _utiloutput;
    return res;
  }
}
module.exports = Hook;
