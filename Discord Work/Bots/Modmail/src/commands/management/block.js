const Command = require("../../classes/Command");

class Block extends Command {
    constructor() {
        super({
            name: 'block',
            description: 'Block a user',
            usage: '``{PREFIX}block <user>``',
            category: 'management'
        })
    }

    async run(client, message, args, guildData, userData) {
        if (userData._id !== message.guild.ownerId && !guildData.managers.includes(userData._id)) {
            return client.embeds.error({
                interaction: interaction,
                options: {
                    error: `You don't have the required bot permissions to block users`,
                    userAuthor: true
                }
            })
        }

        const runInThread = await client.models.logs.findOne({ _id: message.channel.id });

        if (runInThread && !args[0] && !message.mentions.users.first()) {
            const user = await client.models.users.findOne({ _id: message.channel.topic });
            user.blocked = true;
            await user.save();

            return client.embeds.success({
                message: message,
                options: {
                    description: `Successfully blocked <@${message.channel.topic}> from modmail`
                }
            })
        }

        /**
         * 1) Check if cmd is run in thread
         * 2) If not run in thread, or if a user is provided, blacklist them
         * 3) Blacklist user
         */
    }
}

module.exports = Block;