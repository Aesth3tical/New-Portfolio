const { ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const Command = require("../../classes/Command");
const { Permissions } = require("../../utils/enums");

class Logs extends Command {
    constructor() {
        super({
            name: 'logs',
            description: 'Log commands',
            category: 'moderation',
            permissions: Permissions.ManageGuild,
            options: [
                { name: 'view', description: 'View a log', type: ApplicationCommandOptionType.Subcommand, options: [
                    { name: 'user', description: 'User the log is under', type: ApplicationCommandOptionType.User, required: true },
                    { name: 'log_id', description: 'ID of the log', type: ApplicationCommandOptionType.String, required: true },
                ] },
                { name: 'delete', description: 'Delete a log', type: ApplicationCommandOptionType.Subcommand, options: [
                    { name: 'user', description: 'User the log is under', type: ApplicationCommandOptionType.User, required: true },
                    { name: 'log_id', description: 'ID of the log', type: ApplicationCommandOptionType.String, required: true },
                ] },
                { name: 'view_all', description: 'View all logs for a user', type: ApplicationCommandOptionType.Subcommand, options: [
                    { name: 'user', description: 'User the log is under', type: ApplicationCommandOptionType.User, required: true }
                ] }
            ]
        })
    }

    async run({ client, interaction, guildData }) {
        const user = interaction.options.getUser('user');
        const log_id = interaction.options.getString('log_id');
        const operation = interaction.options.getSubcommand();
        const userData = await client.models.users.findOne({ _id: user.id })
            || await new client.models.User({ _id: user.id }).save();

        if (operation === 'view') {
            const log = userData.logs.find(log => log.id === log_id);

            if (!log) {
                return client.embeds.error({
                    interaction: interaction,
                    options: {
                        message: 'That log does not exist under the given user.',
                    }
                })
            }

            const embed = new EmbedBuilder()
                .setColor('Green')
                .addFields([
                    { name: 'User', value: `<@${userData._id}> (${userData._id})`, inline: false },
                    { name: 'Type', value: log.type, inline: false },
                    { name: 'Moderator', value: `<@${log.moderator}> (${log.moderator})`, inline: false },
                    { name: 'ID', value: `\`\`${log.id}\`\``, inline: false },
                    { name: 'Reason', value: log.reason, inline: false },
                ])

            return interaction.editReply({ embeds: [ embed ] })
        } else if (operation === 'delete') {
            const log = userData.logs.find(log => log.id === log_id);

            if (!log) {
                return client.embeds.error({
                    interaction: interaction,
                    options: {
                        message: 'That log does not exist under the given user.'
                    }
                })
            }

            userData.logs = userData.logs.filter(log => log.id !== log_id);
            await userData.markModified('logs');
            await userData.save();

            return client.embeds.success({
                interaction: interaction,
                options: {
                    message: `Log \`\`${log_id}\`\` for ${user} deleted successfully.`
                }
            })
        } else if (operation === 'view_all') {
            // paginate logs, 5 per page
            const logs = userData.logs;
            const pages = Math.ceil(logs.length / 5);
            let page = 0;
            const pagesArray = [];

            for (let i = 0; i < pages; i++) {
                const fields = logs.slice(i * 5, i * 5 + 5).map(log => {
                    return {
                        name: `${log.type}`,
                        value: `> **ID:** ${log.id}\n> **Moderator:** <@${log.moderator}> (${log.moderator})\n> **Reason:** ${log.reason}`,
                        inline: false
                    }
                })

                const embed = new EmbedBuilder()
                    .setColor('Green')
                    .setTitle(`Logs for ${user.tag}`)
                    .setFooter({ text: `Page ${i + 1}/${pages}` })
                    .addFields(fields)
                
                pagesArray.push(embed);
            }

            const menu = new ActionRowBuilder()
                .addComponents([
                    new ButtonBuilder()
                        .setCustomId('back')
                        .setLabel('Back')
                        .setStyle('Primary')
                        .setDisabled(true),
                    new ButtonBuilder()
                        .setCustomId('exit')
                        .setLabel('Exit')
                        .setStyle('Danger'),
                    new ButtonBuilder()
                        .setCustomId('next')
                        .setLabel('Next')
                        .setStyle('Primary')
                        .setDisabled(pages === 1)
                ])
            
            const msg = await interaction.editReply({ embeds: [ pagesArray[page] ], components: [ menu ] });

            const filter = (i) => i.user.id === interaction.user.id;

            const collector = msg.createMessageComponentCollector({ filter, time: 60_000 });

            collector.on('collect', (i) => {
                if (i.customId === 'back') {
                    if (page > 0) page--;
                    console.log('Back', page)
                    if (page === 0) {
                        // Enable next button, disable back button
                        i.update({ embeds: [ pagesArray[page] ], components: [ menu.setComponents([ menu.components[0].setDisabled(true), menu.components[1], menu.components[2].setDisabled(false) ]) ] });
                    } else {
                        // Enable both buttons
                        i.update({ embeds: [ pagesArray[page] ], components: [ menu.setComponents([ menu.components[0].setDisabled(false), menu.components[1], menu.components[2] ]) ] });
                    }
                } else if (i.customId === 'next') {
                    if (page < pagesArray.length - 1) page++;
                    console.log('Next', page)
                    if (page === pagesArray.length - 1) {
                        // Enable back button, disable next button
                        i.update({ embeds: [ pagesArray[page] ], components: [ menu.setComponents([ menu.components[0].setDisabled(false), menu.components[1], menu.components[2].setDisabled(true) ]) ] });
                    } else {
                        // Enable both buttons
                        i.update({ embeds: [ pagesArray[page] ], components: [ menu.setComponents([ menu.components[0].setDisabled(false), menu.components[1], menu.components[2] ]) ] });
                    }
                } else if (i.customId === 'exit') {
                    i.message.delete()
                }
            })
        }
    }
}

module.exports = Logs;