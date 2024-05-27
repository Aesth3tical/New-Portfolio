const Command = require("../../classes/Command");
const { Permissions } = require("../../utils/enums");
const { ApplicationCommandOptionType } = require("discord.js");
const ms = require("ms");

class Mute extends Command {
    constructor() {
        super({
            name: 'mute',
            description: 'Mute a user.',
            category: 'moderation',
            permissions: Permissions.ManageGuild,
            options: [
                { name: 'user', description: 'User to mute', type: ApplicationCommandOptionType.User, required: true },
                { name: 'reason', description: 'Reason for muting the user', type: ApplicationCommandOptionType.String, required: true },
                { name: 'duration', description: 'Duration to mute the user for', type: ApplicationCommandOptionType.String, required: true, choices: [
                    { name: '1 minute', value: '1m' },
                    { name: '5 minutes', value: '5m' },
                    { name: '10 minutes', value: '10m' },
                    { name: '30 minutes', value: '30m' },
                    { name: '1 hour', value: '1h' },
                    { name: '3 hours', value: '3h' },
                    { name: '6 hours', value: '6h' },
                    { name: '12 hours', value: '12h' },
                    { name: '1 day', value: '1d' },
                    { name: '3 days', value: '3d' },
                    { name: '1 week', value: '1w' },
                    { name: '2 weeks', value: '2w' },
                ] }
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
                    message: 'You cannot mute yourself.',
                }
            });
        }

        if (user.id === client.user.id) {
            return client.embeds.error({
                interaction: interaction,
                options: {
                    message: 'You cannot mute me.',
                }
            });
        }

        user = interaction.guild.members.cache.get(user.id);

        if (!user.moderatable) {
            return client.embeds.error({
                interaction: interaction,
                options: {
                    message: 'You cannot mute this user.',
                }
            });
        }

        const reason = interaction.options.getString('reason');

        try {
            await user.disableCommunicationUntil(Date.now() + ms(duration), reason);
        } catch (err) {
            console.error(err)
            return client.embeds.error({
                interaction: interaction,
                options: {
                    message: 'An error occurred while trying to mute this user.',
                }
            });
        }

        await client.logs.log('Mute', {
            guild: interaction.guild,
            user: user.user,
            moderator: interaction.user,
            reason: reason
        });

        return client.embeds.success({
            interaction: interaction,
            options: {
                title: 'User Muted',
                message: `Successfully muted \`\`${user.user.tag}\`\` for \`\`${duration}\`\`.`,
            }
        });
    }
}

module.exports = Mute;