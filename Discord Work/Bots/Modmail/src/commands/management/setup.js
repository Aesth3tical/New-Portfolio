const { EmbedBuilder } = require("discord.js");
const Command = require("../../classes/Command");

class Setup extends Command {
    constructor() {
        super({
            name: 'setup',
            description: 'Setup modmail',
            usage: '``{PREFIX}setup``',
            category: 'management'
        });
    }

    async run(client, message, args, guildData, userData) {
        if (userData._id !== message.guild.ownerId && !guildData.managers.includes(userData._id)) {
            return client.embeds.error({
                interaction: interaction,
                options: {
                    error: `You don't have the required bot permissions to setup modmail`,
                    userAuthor: true
                }
            })
        }

        if (guildData.setup) {
            return client.embeds.error({
                message: message,
                options: {
                    error: `Modmail is already setup. DM me to start a thread!`,
                    userAuthor: false
                }
            })
        }

        let categoryId;
        let logId;

        if (args[0] && !message.guild.channels.cache.get(args[0])) {
            return client.embeds.error({
                message: message,
                options: {
                    error: `Invalid category ID provided. Note: If you don't provide an existing category, one will be created`,
                    userAuthor: false
                }
            })
        } else if (args[0] && message.guild.channels.cache.get(args[0])) {
            categoryId = message.guild.channels.cache.get(args[0]).id;

            const logChannel = await message.guild.channels.create({
                name: 'modmail-logs',
                type: 0,
                parent: categoryId
            })

            logId = logChannel.id;
        } else {
            const category = await message.guild.channels.create({
                name: 'Modmail',
                type: 4
            });

            const logChannel = await message.guild.channels.create({
                name: 'modmail-logs',
                type: 0,
                parent: category.id
            })

            categoryId = category.id;
            logId = logChannel.id;
        }

        guildData.main_category = categoryId;
        guildData.log_channel = logId;
        guildData.setup = true;

        await guildData.save();

        return client.embeds.success({
            message: message,
            options: {
                description: `Modmail setup successfully! Log channel: <#${logId}>`,
                userAuthor: false
            }
        })
    }
}

module.exports = Setup;