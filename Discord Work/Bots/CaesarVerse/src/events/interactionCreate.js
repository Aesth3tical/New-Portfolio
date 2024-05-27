const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const Event = require("../classes/Event");
const ms = require('ms');
const { handleButton } = require('../utils/handle-button');

class InteractionCreate extends Event {
    constructor() {
        super('interactionCreate');
    }

    async run(client, interaction) {
        if (interaction.isCommand()) {
            if (interaction.commandName !== 'embed') await interaction.deferReply();

            const guildData = await client.models.guilds.findOne({ _id: interaction.guildId })
                || await new client.models.Guild({ _id: interaction.guild.id }).save();
            
            let userData = await client.models.users.findOne({ _id: interaction.user.id })
                || await new client.models.User({ _id: interaction.user.id }).save();

            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            const now = Date.now();

            if (command.cooldown) {
                const cooldownAmount = Math.floor(command.cooldown) * 60000;

                let cd = userData.cooldowns.find(c => c.command === interaction.commandName && c.guild === interaction.guild.id);

                if (!cd) {
                    let cdObj = { command: interaction.commandName, guild: interaction.guild.id, cooldown: 0 };
                    await userData.cooldowns.push(cdObj);
                    await userData.markModified('cooldowns')
                    await userData.save();
                    cd = userData.cooldowns.find(c => c.command === interaction.commandName && c.guild === interaction.guild.id);
                }

                if (cd.cooldown !== 0) {
                    const expirationTime = cd.cooldown + cooldownAmount;

                    if (now < expirationTime) {
                        const time = expirationTime - now;

                        return client.embeds.error({
                            interaction: interaction,
                            options: {
                                message: `You are on cooldown for this command. Please wait \`\`${ms(time, { long: true })}\`\`.`,
                            }
                        });
                    }
                }

                cd.cooldown = now;
                await userData.markModified('cooldowns')
                await userData.save();

                setTimeout(async () => {
                    cd.cooldown = 0;
                    await userData.markModified('cooldowns')
                    await userData.save();
                }, cooldownAmount);
            }

            command.run({ client, interaction, guildData });
        } else if (interaction.isButton()) {
            await handleButton(client, interaction)
        }
    }
}

module.exports = InteractionCreate;
