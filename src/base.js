const util = require('./util');
/**
 * The options passed to the Webhook constructor
 * @typedef {Object} WebhookOptions
 * @property {string} [link] - Override the location the Webhook is POSTed to.
 * @property {function} [handler] - The Ratelimit Handler
 * @example
 * {
 *   'link':'https://discordapp.com/path/to/Webhook/',
 *    handler: function(err) {
 *      console.log('Ratelimit Request Limit: ' + err.limit);
 *      console.log('Remaining Requests: ' + err.remaining);
 *      console.log('Time until Reset: ' + err.reset)
 *    }
 * }
 */

/**
 * @typedef {Object} Response
 * The response returned from the Webhook. See {@link https://snekfetch.js.org/?api=snekfetch#Snekfetch.SnekfetchResponse|Snekfetch Response} for more information.
 */
/**
 * The actual Webhook Object
 * @typedef {Object} WebhookJSON
 * @property {string} [content] - The message contents. (Limit 2000 characters). (Only one of content, files and embeds are allowed)
 * @property {string} [username] - Overrides the default Webhook username.
 * @property {string} [avatar_url] - Overrides the default Webhook avatar.
 * @property {Boolean} [tts] - Whether the message is a TTS message.
 * @property {File} [file] - The contents of the file. (Only one of content, files and embeds are allowed)
 * @property {Embed} [embeds] - An array of embeds. (Only one of content, files and embeds are allowed)
 * @example
 * {
 *   'username': "Hook Bot!",
 *   'avatar_url': "https://example.com/path/to/image.png",
 *   'tts': false,
 *   'embeds': [
 *     {
 *       'title':'Hello World!'
 *     }
 *   ]
 * }
 */
/**
 * The base Webhook class.
 * @deprecated since version 2.0.0
 * @example
 * var Base = require('hookcord').Base
 */
class Base {
  /**
   * @param {string} [Code] Webhook ID + Secret in the form of <code>"HOOK_ID/HOOK_SECRET"</code>. Either `link` or `Options.link` is required
   * @param {WebhookOptions} [Options] Options to initialise the Webhook with
   * @param {WebhookJSON} [Preload] A premade webhook
   * @example
   * new Base("HOOK_ID/HOOK_SECRET", {}, {'content':'Hello World!'})
   * @example
   * // Or:
   * new Base("", {'link': 'https://discordapp.com/api/webhooks/ID/SECRET'}, {'content':'Hello World!'})
   */
  constructor(link, opts = {}, preload = undefined) {
    console.warn('This class has been deprecated. Use the Hook class instead. More information: maxrumsey.xyz/hookcord/');
    if (opts.link) {
      /**
       * @type {string}
       * @description The link the webhook will be POSTed to
       */
      this.endpoint = opts.link;
    } else if (link) {
      this.endpoint = 'https://discordapp.com/api/webhooks/' + link;
    } else {
      throw new Error('No link is present to POST to.');
    }
    this.handler = opts.handler;
    /**
     * @type {WebhookJSON}
     * @description Webhook payload
     */
    this.payload = preload;
    /**
     * @type {WebhookOptions}
     * @description The options to be passed to the Webhook constructor
     */
    this.opts = opts;
  }
  /**
   * @description POSTS the payload to the endpoint
   * @returns {Response}
   * @example
   * const Hook = new Hookcord.Base("CLIENT/SECRET", {}, WEBHOOK)
   * Hook.send()
   */
  async send() {
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
module.exports = Base;
