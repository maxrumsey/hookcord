/**
 * Parses Discord.JS embeds and turns them into webhooks.
 * @returns {WebhookJSON}
 * @param {Object} DiscordJSEmbed The {@link https://discord.js.org/#/docs/main/stable/class/RichEmbed|Discord.JS Embed} to pass into the parser.
 * @example
 * var embed = new Discord.RichEmbed();
 * embed.setTitle('Hello!')
 * hookcord.Fire("HOOK ID/HOOK SECRET", {}, hookcord.DiscordJS(embed))
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
