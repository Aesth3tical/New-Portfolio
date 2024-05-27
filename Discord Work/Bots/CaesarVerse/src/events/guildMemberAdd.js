const { EmbedBuilder, Guild } = require("discord.js");
const Event = require("../classes/Event");

class GuildMemberAdd extends Event {
    constructor() {
        super("guildMemberAdd");
    }

    async run(client, member) {
        const embed = new EmbedBuilder()
            .setColor('White')
            .setTitle('Member Joined')
            .setDescription(`Welcome to the server, ${member}!\n\n**Be sure to read up on the following channels:**\n> - <#1104042001558671441>\n> - <#1104042001558671440>\n> - - <#1104042001558671447>\n> - <#1105154998318411806>`)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))

        client.channels.cache.get('1104042001558671442').send({ embeds: [ embed ] })
    }
}

module.exports = GuildMemberAdd;