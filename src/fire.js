const snekfetch = require('snekfetch');
/**
 * A function that fires Webhooks. Basically the function version of {@link Base}.
 * @name Fire
 * @param {string} Link - The details or link the Webhook will fire to.
 * @param {WebhookOptions} [Options] - Custom options.
 * @param {WebhookJSON} Payload - The payload that will be fired to the link.
 * @returns {Response}
 */
var Fire = async function(link, opts = {}, payload) {
  if (!payload) {
    return new Error('Payload has not been provided.');
  }
  if (!(link || opts.link)) {
    return new Error('Link has not been provided.');
  }
  if (link.split('/').length === 2) {
    link = 'https://discordapp.com/api/webhooks/' + link;
  }

  var res = await snekfetch.post(link || opts.link)
    .send(payload);
  return res;
};

module.exports = Fire;
