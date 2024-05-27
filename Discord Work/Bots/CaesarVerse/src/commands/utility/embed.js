const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const Command = require("../../classes/Command");
const { Permissions } = require("../../utils/enums");

class Embed extends Command {
    constructor() {
        super({
            name: 'embed',
            description: 'Send an embed to a channel',
            options: [
                { name: 'channel', description: 'Channel to send the embed to', type: ApplicationCommandOptionType.Channel, required: true },
            ],
            category: 'staff',
            permissions: Permissions.Administrator
        })
    }

    async run({ client, interaction }) {
        const embedModal = new ModalBuilder()
            .setCustomId('embed_modal')
            .setTitle('Embed Creator')
        
        const titleInput = new TextInputBuilder()
            .setCustomId('embed_title')
            .setLabel('Embed title')
            .setPlaceholder('Title you wish to see on the embed')
            .setStyle(TextInputStyle.Short)
            .setRequired(false)
            .setMaxLength(256)
        
        const descriptionInput = new TextInputBuilder()
            .setCustomId('embed_description')
            .setLabel('Embed description')
            .setPlaceholder('Description you wish to see on the embed')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false)
            .setMaxLength(2048)
        
        const thumbnailInput = new TextInputBuilder()
            .setCustomId('embed_thumbnail')
            .setLabel('Embed thumbnail')
            .setPlaceholder('Thumbnail you wish to see on the embed')
            .setStyle(TextInputStyle.Short)
            .setRequired(false)
        
        const imageInput = new TextInputBuilder()
            .setCustomId('embed_image')
            .setLabel('Embed image')
            .setPlaceholder('Image (url) you wish to see on the embed')
            .setStyle(TextInputStyle.Short)
            .setRequired(false)
        
        const titleRow = new ActionRowBuilder().addComponents(titleInput);
        const descriptionRow = new ActionRowBuilder().addComponents(descriptionInput);
        const thumbnailRow = new ActionRowBuilder().addComponents(thumbnailInput);
        const imageRow = new ActionRowBuilder().addComponents(imageInput);

        embedModal.addComponents(titleRow, descriptionRow, thumbnailRow, imageRow);

        await interaction.showModal(embedModal);
        const filter = (i) => i.customId === 'embed_modal';

        interaction.awaitModalSubmit({ filter, time: 600_000 })
            .then(async (submission) => {
                const channel = interaction.options.getChannel('channel');
                const image = submission.fields.getField('embed_image').value;
                const title = submission.fields.getField('embed_title').value;
                const description = submission.fields.getField('embed_description').value;
                const thumbnail = submission.fields.getField('embed_thumbnail').value;
        
                const embed = new EmbedBuilder()
                    .setColor('White')
                
                if (title) embed.setTitle(title)
                if (description) embed.setDescription(description)
                if (thumbnail) embed.setThumbnail(thumbnail)
                if (image) embed.setImage(image)
                
                try {
                    channel.send({ embeds: [ embed] });
                    return client.embeds.success({
                        interaction: submission,
                        options: {
                            message: 'Embed sent successfully.'
                        }
                    });
                } catch (error) {
                    return client.embeds.error({
                        interaction: submission,
                        options: {
                            message: 'I was unable to send the embed to that channel.'
                        }
                    });
                }
            })
            .catch(() => {});
    }
}

module.exports = Embed;