const { EmbedBuilder } = require("discord.js");

module.exports.handleModmail = async (client, message, guildData, userData) => {
    if (!guildData.setup) {
        return client.embeds.error({
            message: message,
            options: {
                error: `Modmail is not setup! Please have a server manager run the \`\`${guildData.prefix}setup\`\` command to get started`,
                userAuthor: false
            },
        })
    }

    
    let guild = client.guilds.cache.get(process.env.MODMAIL_GUILD);
    
    let thread = guild.channels.cache.find(c => c.topic === userData._id);

    if (thread) {
        const threadLog = await client.models.logs.findOne({ _id: thread.id });
        if (!threadLog) console.error(`Thread error: threadLog for ${thread.id} not found`)

        const userMessage = new EmbedBuilder()
            .setColor('Green')
            .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ format: 'png' }) })
            .setDescription(message.content)
            .setTimestamp()

        let pings = [];
        threadLog.subscribed?.forEach(sub => pings.push(sub));
        threadLog.alert?.forEach(alert => pings.push(alert));

        pings = pings.map(ping => `<@${ping}>`).join(', ');

        pings !== 'undefined' ? thread.send({ content: pings, embeds: [ userMessage ] }) : thread.send({ embeds: [ userMessage ]})

        threadLog.messages.push({
            user: message.author,
            avatar: message.author.displayAvatarURL({ format: 'png' }),
            timestamp: message.createdTimestamp,
            internal: false,
            content: message.content,
        })

        threadLog.alert = [];
        await threadLog.markModified('messages');
        await threadLog.save();

        await message.react('<:success:993459347021631498>');
    } else {
        try {
            await guild.channels.create({
                name: `${message.author.username}-${message.author.discriminator}`,
                type: 0,
                topic: message.author.id,
                parent: guildData.main_category
            }).then(channel => thread = channel);
        } catch (err) {
            try {
                const fallback = guildData.categories.find(c => c.name === 'fallback');

                if (fallback) {
                    await guild.channels.create({
                        name: `${message.author.username}-${message.author.discriminator}`,
                        type: 0,
                        topic: message.author.id,
                        parent: guildData
                    }).then(channel => thread = channel)
                } else {
                    console.error(`Thread not created - fallback not available`);
                    return await message.react('<:error:993458753972211754>');
                }
            } catch (err) {
                console.error(`Thread not created - fallback not available`);
                return await message.react('<:error:993458753972211754>');
            }
        }

        const mainGuildMember = client.guilds.cache.get(process.env.MAIN_GUILD).members.cache.get(message.author.id);
        const mainGuildMemberRoles = [];
        let extraRoles;
        mainGuildMember.roles.cache.forEach(role => {
            mainGuildMemberRoles.push(role.toString());
        })

        if (mainGuildMemberRoles.length > 19) {
            extraRoles = mainGuildMemberRoles.slice(19);
        }

        const threadCreatedEmbed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('Thread created')
            .setThumbnail(message.author.displayAvatarURL({ format: 'png' }))
            .setDescription(`Use \`\`!r\`\` or \`\`!ar\`\` to reply`)
            .addFields(
                { name: 'User', value: mainGuildMember?.toString(), inline: true },
                { name: 'UserID', value: mainGuildMember?.id, inline: true },
                { name: 'Joined Main Guild', value: `<t:${String(mainGuildMember.joinedTimestamp / 1000).split('.')[0]}:R>`, inline: true },
                { name: 'Roles', value: mainGuildMemberRoles.length > 19 ? `${mainGuildMemberRoles.slice(0, 3).join(', ')} **+ ${extraRoles.length} More**` : `${mainGuildMemberRoles.join(', ')}`, inline: false }
            )
        
        const threadCreatedUserMessage = new EmbedBuilder()
            .setColor('Green')
            .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ format: 'png' }) })
            .setDescription(message.content)
            .setTimestamp()
        
        const threadCreatedUserEmbed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('Thread created')
            .setDescription(`Thanks for contacting modmail! Staff will reply shortly`)
        
        thread.send({ content: '@here', embeds: [ threadCreatedEmbed ] });
        thread.send({ embeds: [ threadCreatedUserMessage ] });
        message.author.send({ embeds: [ threadCreatedUserEmbed ] });

        const threadLog = new client.models.Log({ _id: thread.id, user: message.author.id });

        threadLog.messages.push({
            user: message.author,
            avatar: message.author.displayAvatarURL({ format: 'png' }),
            timestamp: message.createdTimestamp,
            internal: false,
            content: message.content
        })

        await threadLog.markModified('messages');
        await threadLog.save();
    }
}