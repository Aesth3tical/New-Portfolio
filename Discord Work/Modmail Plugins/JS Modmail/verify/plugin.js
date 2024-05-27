let verificationEnabled = true;

module.exports.plugin = {
    name: 'verify',
    description: 'Verify in the Devetical Discord server',
    author: 'Dan Perkins (Aesth3tical)',
    repository: 'https://github.com/Aesth3tical/MM-Plugins-Priv/blob/main/add/plugin.js'
}

module.exports.verificationToggle = {
    name: 'tverify',
    description: 'Toggle verification',
    usage: `!tverify`,
    category: 'staff',
    run: async ({ client, message, args }) => {
        if (verificationEnabled === true) {
            verificationEnabled = false;
            
            return client.embeds.success({
                message: message,
                options: {
                    description: 'Successfully **disabled** verification'
                }
            })
        } else {
            verificationEnabled = true;
            
            return client.embeds.success({
                message: message,
                options: {
                    description: 'Successfully **enabled** verification'
                }
            })
        }
    }
}

module.exports.verify = {
    name: 'verify',
    description: 'Verify in the Devetical Discord server',
    usage: `!verify`,
    category: 'utility',
    run: async ({ client, message, args }) => {
        if (!verificationEnabled) return message.delete();
        if (message.channel.id !== '1046575593254293514') return message.delete();
        
        const unverifiedRole = message.guild.roles.cache.get('1046579541809836082');
        
        if (!unverifiedRole) return client.embeds.error({
            message: message,
            options: {
                error: `That command can only be run in the server "Devetical"`
            }
        });
        
        if (!message.member.roles.cache.some(r => r.id === unverifiedRole.id)) return client.embeds.error({
            message: message,
            options: {
                error: `You're already verified!`,
            }
        })
        
        message.member.roles.add('925514457000595486');
        message.member.roles.remove('1046579541809836082');
        return message.delete()
    }
}
