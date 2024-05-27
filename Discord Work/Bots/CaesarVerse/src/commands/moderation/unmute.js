const Command = require("../../classes/Command");
const { Permissions } = require("../../utils/enums");
const { ApplicationCommandOptionType } = require("discord.js");

class UnMute extends Command {
    constructor() {
        super({
            name: 'unmute',
            description: 'Unmute a user.',
            category: 'moderation',
            permissions: Permissions.ManageGuild,
            options: [
                { name: 'user', description: 'User to unmute', type: ApplicationCommandOptionType.User, required: true }
            ]
        })
    }

    async run({ client, interaction, guildData }) {
        let user = interaction.options.getUser('user');

        user = interaction.guild.members.cache.get(user.id);

        if (!user.moderatable) {
            return client.embeds.error({
            interaction: interaction,
            options: {
                    message: 'You cannot unmute this user.',
                }
            });
        }

        if (!user.isCommunicationDisabled) {
            return client.embeds.error({
                interaction: interaction,
                options: {
                    message: 'This user is not muted.',
                }
            });
        }

        try {
            await user.disableCommunicationUntil(null);
        } catch (err) {
            console.error(err)
            return client.embeds.error({
                interaction: interaction,
                options: {
                    message: 'An error occurred while trying to unmute this user.',
                }
            });
        }

        await client.logs.log('Unmute', {
            guild: interaction.guild,
            user: user.user,
            moderator: interaction.user
        });

        return client.embeds.success({
            interaction: interaction,
            options: {
                title: 'User Unmuted',
                message: `Successfully unmuted \`\`${user.user.tag}\`\`.`,
            }
        });
    }
}

module.exports = UnMute;