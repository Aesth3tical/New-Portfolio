module.exports.plugin = {
    name: 'add',
    description: 'Add numbers together',
    author: 'Dan Perkins (Aesth3tical)',
    repository: 'https://github.com/Aesth3tical/MM-Plugins-Priv/blob/main/add/plugin.js'
}

module.exports.add = {
    name: 'add',
    description: 'Add numbers',
    usage: `!add <numbers>`,
    category: 'utility',
    run: async (client, message, args) => {
        let sum = 0;
        
        for (const arg of args) {
            sum += parseInt(arg)
        }
        
        message.reply({ content: `The sum is ${sum}!` })
    }
}
