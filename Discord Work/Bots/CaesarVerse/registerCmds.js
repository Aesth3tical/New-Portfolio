require('dotenv').config();

const { REST, Routes } = require('discord.js');
const { readdirSync } = require('fs');
const { join } = require('path');

module.exports = async () => {
    console.log('Deploying slash commands...')
    const cmdMap = new Map();

    readdirSync(join(__dirname, 'src/commands')).forEach(folder => {
        readdirSync(join(__dirname, `src/commands/${folder}`)).forEach(file => {
            const Command = require(join(__dirname, `src/commands/${folder}/${file}`));
            const command = new Command();
            cmdMap.set(command.name, command);
        })
    })

    const cmdArray = [...cmdMap].map(([name, value]) => (name, value));
    cmdArray.forEach(cmd => [ 'cooldown', 'category' ].forEach(prop => delete cmd[prop]));
    const slashCmds = cmdArray.map(obj => obj);
    
    const rest = new REST({ version: 10 }).setToken(process.env.token);

    (async () => {
        try {
            console.log('Started refreshing application (/) commands.');
            await rest.put(
                Routes.applicationCommands(process.env.client_id),
                { body: slashCmds },
            );
            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    })();
}