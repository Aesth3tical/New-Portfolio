module.exports.handleButton = async (client, interaction) => {
    const guildData = await client.models.guilds.findOne({ _id: interaction.guildId })
        || await new client.models.Guild({ _id: interaction.guild.id }).save();
    
    const userData = await client.models.users.findOne({ _id: interaction.user.id })
        || await new client.models.User({ _id: interaction.user.id }).save();
    
    const button = client.buttons.get(interaction.customId);
}