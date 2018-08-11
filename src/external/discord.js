/**
 * Discord.JS - Discord.JS Webhook Parser
 * @returns {WebhookJSON}
 */
function DiscordJS(embed) {
  if (embed.file) {
    console.log('Files in embeds will not be sent.');
    embed.file = undefined;
  }
  return {
    'embeds': [
      embed,
    ],
  };
}

module.exports = DiscordJS;
