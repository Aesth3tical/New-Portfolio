const { EmbedBuilder } = require("discord.js");

class LogManager {
    constructor(client, logchannel, db) {
        this.db = db;
        this.client = client;
        this.logChannel = logchannel;
        this.states = (data) => data ? 'Green' : 'Red';
    }

    async log(type, data) {
        const { user, moderator, reason } = data;
        const userData = await this.client.models.users.findOne({ _id: user.id })
            || await new this.client.models.User({ _id: user.id }).save();

        function genID() {
            let result = [];
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const charLength = characters.length;
            for (let i = 0; i < 3; i++) {
                let str = '';
                for (let i = 0; i < 5; i++) {
                    str += characters.charAt(Math.floor(Math.random() * charLength));
                }
                result.push(str);
            }
            return result.join('-');
        }

        const state = this.states(type.toLowerCase().startsWith('un'));

        const log = {
            type: type,
            moderator: moderator.id,
            reason: reason ? reason : 'No reason provided.',
            date: new Date().toISOString(),
            id: genID(),
        };

        userData.logs.push(log);
        await userData.markModified('logs');
        await userData.save();

        const embed = new EmbedBuilder()
            .setColor(state)
            .setAuthor({ name: `${moderator.tag} ${type.toLowerCase().endsWith('e') ? type.toLowerCase() + 'd' : type.toLowerCase() + 'ed'} ${user.tag}`, iconURL: user.displayAvatarURL({ extension: 'png', size: 2048 }) })
            .addFields([
                { name: 'User', value: `${user.tag} (${user.id})`, inline: true },
                { name: 'Moderator', value: `${moderator.tag} (${moderator.id})`, inline: true },
                { name: 'Reason', value: reason ? reason : 'No reason provided', inline: false },
            ])
            .setFooter({ text: `ID: ${log.id}` });
        
        const channel = this.client.channels.cache.get(this.logChannel);
        await channel.fetchWebhooks()
            .then(async (webhooks) => {
                let webhook = webhooks.find(w => w.name === 'Logging');
                if (!webhook) {
                    webhook = await channel.createWebhook({
                        name: 'Logging',
                        avatar: this.client.user.displayAvatarURL({ extension: 'png', size: 2048 }),
                    });
                }
                await webhook.send({ embeds: [embed] });
            });
    }
}

module.exports = LogManager;