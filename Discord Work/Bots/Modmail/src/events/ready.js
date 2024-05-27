const Event = require('../classes/Event');

class ReadyEvent extends Event {
    constructor() {
        super('ready');
    }

    async run(client) {
        for (const guild of client.guilds.cache.values()) {
            await guild.members.fetch().catch(() => null);
            await guild.channels.fetch().catch(() => null)
        }

        if (process.env.SLASH_COMMANDS === 'true') {
            client.application.commands.set(client.commands.map(cmd => cmd));
        } else client.application.commands.set([]);

        console.log(`Logged in as ${client.user.username}`);
    }
}

module.exports = ReadyEvent;