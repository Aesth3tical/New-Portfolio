const Command = require("../../classes/Command");
const { Permissions } = require("../../utils/enums");
const { ApplicationCommandOptionType } = require("discord.js");
const ms = require("ms");

class Warn extends Command {
    constructor() {
        super({
            name: 'warn',
            description: 'Warn a user.',
            category: 'moderation',
            permissions: Permissions.ManageGuild,
            options: [
                { name: 'user', description: 'User to warn', type: ApplicationCommandOptionType.User, required: true },
                { name: 'reason', description: 'Reason for warning the user', type: ApplicationCommandOptionType.String, required: true }
            ]
        })
    }

    async run({ client, interaction, guildData }) {
        let user = interaction.options.getUser('user');
        const duration = interaction.options.getString('duration');

        if (user.id === interaction.user.id) {
            return client.embeds.error({
                interaction: interaction,
                options: {
                    message: 'You cannot warn yourself.',
                }
            });
        }

        if (user.id === client.user.id) {
            return client.embeds.error({
                interaction: interaction,
                options: {
                    message: 'You cannot warn me.',
                }
            });
        }

        user = interaction.guild.members.cache.get(user.id);

        if (!user.moderatable) {
            return client.embeds.error({
                interaction: interaction,
                options: {
                    message: 'You cannot warn this user.',
                }
            });
        }

        const reason = interaction.options.getString('reason');

        await client.logs.log('Warn', {
            guild: interaction.guild,
            user: user.user,
            moderator: interaction.user,
            reason: reason
        });

        return client.embeds.success({
            interaction: interaction,
            options: {
                title: 'User Warned',
                message: `Successfully warned \`\`${user.user.tag}\`\`\n\n**Reason:**\n> ${reason}`,
            }
        });
    }
}

module.exports = Warn;