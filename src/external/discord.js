/**
 * Parses Discord.JS embeds and turns them into webhooks.
 * @returns {WebhookJSON}
 * @param {Object} DiscordJSEmbed The {@link https://discord.js.org/#/docs/main/stable/class/RichEmbed|Discord.JS Embed} to pass into the parser.
 * @example
 * var embed = new require('discord.js').RichEmbed();
 * embed.setTitle('Hello!')
 * let hook = new hookcord.Hook();
 * hook.login('ID', 'SECRET')
 *  .setPayload(hookcord.DiscordJS(embed));
 *  .fire()
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
