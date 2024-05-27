const Command = require('../../classes/Command');
const { isThread } = require('../../utils/isThread');

class Reply extends Command {
    constructor() {
        super({
            name: 'reply',
            description: 'Reply to a user in a modmail thread',
            usage: '``{PREFIX}reply <message>``',
            category: 'modmail'
        })
    }

    async run(client, message, args, guildData, userData) {
        const thread = await isThread(client, message);

        if (!thread) {
            return client.embeds.error({
                message: message,
                options: {
                    error: `Reply commands can only be run in a modmail thread`
                }
            })
        }

        
    }
}

module.exports = Reply;