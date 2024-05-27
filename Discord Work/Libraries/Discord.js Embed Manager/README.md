# DjsEmbedManager
DjsEmbedManager is a single dependency library to manage (currently) success and error embeds via an embed manager to attach to your bot client and send as a response to the user. This feature alone results in cleaner code, and more organized embeds for the user experience.

```npm install djsembedmanager```

### Setup
Currently DjsEmbedManager supports interactions, though message support as well as additional customization options are coming soon. To setup the library in your code, simply use the following -

```js
const { Client } = require('discord.js');
const EmbedsManager = require('djs-embedmanager');

const client = new Client();

client.embeds = new EmbedsManager();

client.on('interactionCreate', interaction => {
    if (interaction.isCommand() && interaction.commandName = 'hi') {
        return client.embeds.success({
            interaction: interaction,
            options: {
                message: `Hello, ${interaction.user}! How are you?`
            }
        })
    }
});

client.login('token');
```

instead of -
```js
const { Client } = require('discord.js');

const client = new Client();

client.on('interactionCreate', interaction => {
    if (interaction.isCommand() && interaction.commandName = 'hi') {
        const embed = new EmbedBuilder()
            .setColor('Green')
            .setDescription(`Hey ${interaction.user}! How are you today?`)
        
        return interaction.reply({
            embeds: [ embed ]
        })
    }
});

client.login('token');
```

DjsEmbedManager currently features ``success``, ``error`` and ``default`` options, with default allowing for custom colors to be passed through the ``options`` object like so -
```js
return client.embeds.default({
    interaction: interaction,
    options: {
        message: `Hi there, ${interaction.user}!`,
        color: 'Blue'
    }
})