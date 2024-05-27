const Command = require("../../classes/Command");
const { installPlugin } = require('../../utils/installPlugin');

class Plugins extends Command {
    constructor() {
        super({
            name: 'plugins',
            description: 'Plugin management commands',
            usage: '``{PREFIX}plugin [add|remove] <github_link|plugin_name>``',
            category: 'management'
        })
    }

    async run(client, message, args, guildData, userData) {
        if (![ 'add', 'remove' ].includes(args[0])) {
            return client.embeds.error({
                message: message,
                options: {
                    error: `Invalid command format. Command usage: ${this.usage.replace('{PREFIX}', guildData.prefix)}`
                }
            })
        }

        if (args[0] === 'add') {
            let link = args.slice(1).join('');

            if (link.match(/https:\/\/github.com\/[A-z0-9-_]+\/[A-z0-9-_]+\/[blob|tree]+\/[main|master]+\/([A-z0-9-_\/])+.js$/g)) {
                link = 'https://raw.githubusercontent.com/' + link.slice('19').split('/').filter(i => ![ 'blob', 'tree' ].includes(i)).join('/')
                console.log(link)

                return installPlugin(client, message, guildData, link)
            } else return client.embeds.error({
                message: message,
                options: {
                    error: `Invalid github link provided for plugin.`
                }
            })
        } else if (args[0] === 'remove') {

        }
    }
}

module.exports = Plugins;