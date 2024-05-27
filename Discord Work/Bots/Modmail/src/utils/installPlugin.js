const { get } = require("axios");
const { writeFileSync, rename } = require('fs');
const { join } = require("path");

module.exports.installPlugin = async (client, message, guildData, link) => {
    const code = String((await get(link)).data)

    writeFileSync(join(__dirname, '../plugins/plugin.js'), code)
    
    const plugin = require('../plugins/plugin')
    const pluginConfig = plugin['plugin'];
    const pluginCmds = [];
    rename(join(__dirname, '../plugins/plugin.js'), join(__dirname, `../plugins/${pluginConfig.name.toLowerCase()}.js`), function(err) {
        if (err) console.error(err)
    })


    for (const command of pluginConfig.commands) {
        const cmd = plugin[command]
        client.commands.set(cmd.name, cmd);
        pluginCmds.push({
            name: cmd.name,
            description: cmd.description
        })
    }

    guildData.installed_plugins.push({
        plugin: pluginConfig.name,
        author: pluginConfig.author,
        link: link,
        commands_added: pluginCmds
    })
    
    await guildData.markModified('installed_plugins');
    await guildData.save();

    return client.embeds.success({
        message: message,
        options: {
            title: `Plugin "${pluginConfig.name}" installed successfully`,
            description: `Successfully installed the \`\`${pluginConfig.name}\`\` plugin from **${pluginConfig.author}**!\n\nThe following commands have been installed in the bot:\n${pluginCmds.map(cmd => `> • **${cmd.name}** - ${cmd.description}`).join('\n')}`,
            footer: { text: `Developer's note - not all plugins may work as intended, as the majority are likely made by independent developers. See !plugins help for information on plugins` }
        }
    })
}