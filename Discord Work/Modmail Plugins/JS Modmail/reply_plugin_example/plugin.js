const { handleMessage } = require('../utils/handleStaffMessage.js');

module.exports.plugin = {
    name: 'reply_plugin_example',
    description: 'Reply features',
    author: 'Dan Perkins (Aesth3tical)',
    repository: 'https://github.com/Aesth3tical/MM-Plugins/Priv/reply_plugin_example/plugin.js'
}

module.exports.hold = {
    name: 'hold',
    description: 'Send a hold message to a client',
    run: async (client, message) => {
        return handleMessage(client, message, 'Please hold while we find a suitable representative to assist you.')
    }
}
