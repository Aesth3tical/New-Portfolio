const Event = require('../classes/Event');

class InteractionCreateEvent extends Event {
    constructor() {
        super('interactionCreate');
    }

    async run(client, interaction) {
        if (!interaction.isCommand()) return

        const guildData = await client.models.guilds.findOne({ _id: interaction.guild.id })
            || await new client.models.Guild({ _id: interaction.guild.id }).save();
        const userData = await client.models.users.findOne({ _id: interaction.user.id })
            || await new client.models.User({ _id: interaction.user.id });
        
        const cmdName = interaction.commandName;
        const cmd = client.commands.get(cmdName);
        
        if (!cmd) return;

        cmd.run(client, interaction, guildData, userData);
    }
}

module.exports = InteractionCreateEvent;