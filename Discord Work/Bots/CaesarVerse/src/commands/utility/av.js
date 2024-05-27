const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const Command = require("../../classes/Command");

class Av extends Command {
    constructor() {
        super({
            name: 'av',
            description: 'Get a user\'s avatar.',
            options: [
                { name: 'user', description: 'User to get the avatar of', type: ApplicationCommandOptionType.User, required: false }
            ],
        })
    }

    async run({ client, interaction }) {
        let user = interaction.options.getUser('user') || interaction.user;

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${user.tag}'s Avatar`, iconURL: user.displayAvatarURL({ extension: 'png', size: 2048 }) })
            .setImage(user.displayAvatarURL({ extension: 'png', size: 2048 }))

        await interaction.editReply({ embeds: [embed] });
    }
}

module.exports = Av;