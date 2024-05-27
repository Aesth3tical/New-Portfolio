const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const Command = require("../../classes/Command");
const { Permissions } = require("../../utils/enums");

class MassRole extends Command {
    constructor() {
        super({
            name: 'massrole',
            description: 'Add a role to multiple users.',
            category: 'utility',
            permissions: Permissions.Administrator,
            options: [
                { name: 'role', description: 'Role to add', type: ApplicationCommandOptionType.Role, required: true }
            ]
        })
    }

    async run({ client, interaction }) {
        const role = interaction.options.getRole('role');

        await interaction.guild.members.fetch();
        const members = interaction.guild.members.cache.filter(member => !member.roles.cache.has(role.id));

        const embed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('Mass Role')
            .setDescription(`Adding the ${role} role to ${members.size} members.\n\nApprox completion: \`\`${((members.size * .1) / 60).toFixed()}m\`\``)
        
        interaction.channel.send({ embeds: [ embed ] })

        await members.each(async member => {
            member.roles.add(role);
            await new Promise(resolve => setTimeout(resolve, 100));
        })

        return client.embeds.success({
            interaction: interaction,
            options: {
                message: `Total members: ${members.size}`,
            }
        })
    }
}

module.exports = MassRole;