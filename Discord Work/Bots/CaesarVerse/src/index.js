module.exports = async() => {
    const { IntentsBitField, Partials } = require("discord.js");
    const Bot = require("./classes/Bot");
    require('dotenv').config();

    const client = new Bot({
        intents: [
            IntentsBitField.Flags.Guilds,
            IntentsBitField.Flags.GuildScheduledEvents,
            IntentsBitField.Flags.GuildMessages,
            IntentsBitField.Flags.GuildMembers
        ],
        partials: [
            Partials.Channel,
            Partials.Message,
            Partials.User,
        ],
        shards: 'auto',
    })

    client.start();
}
