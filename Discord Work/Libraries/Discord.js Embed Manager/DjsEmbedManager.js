const Discord = require("discord.js");

/**
 * @typedef {{
 *   interaction: Discord.Interaction,
 *   options: Options,
 *   ephemeral: boolean
 * }} FunctionArguments
 * @typedef {{
 *   color?: string,
 *   author?: boolean,
 *   footer?: object,
 *   title?: string,
 *   thumbnail?: string,
 *   image?: string,
 *   message: string
 * }} Options
 */

/** @enum {string} */
const Colors = {
    SUCCESS: "Green",
    ERROR: "Red",
};

/** @enum {string} */
const Prefixes = {
    SUCCESS: ":white_check_mark: ",
    ERROR: ":x: ",
    NONE: "",
};

/**
 * Sets the embed's contents from the options object specified
 * @param {Discord.Embed} embed
 * @param {Options} options
 */
function embedContentsFromOptions(embed, options) {
    if (options.author && typeof options.author === "boolean")
        embed.setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL({
                format: "png",
            }),
        });
    if (options.footer && typeof options.footer === "object")
        embed.setFooter(options.footer);
    if (options.title && typeof options.title === "string")
        embed.setTitle(options.title);
    if (options.thumbnail && typeof options.title === "string")
        embed.setThumbnail(options.thumbnail);
    if (options.image && typeof options.image === "string")
        embed.setImage(options.image);
}

/**
 * Verifys specified arguments for validation
 * @param {Discord.Interaction} interaction
 * @param {Options} options
 * @private
 */
function verifyArguments(interaction, options) {
    if (!interaction || !options)
        throw new Error(
            `One or more required properties are missing to run the "success" method.`
        );
    if (!options.message)
        throw new Error(`You must supply a message for the "success" method`);
}

/**
 * Sends an embed with the specified options
 *
 * @typedef {{color: string, prefix: string}} EmbedSettings
 * @param {Discord.Interaction} interaction
 * @param {Options} options
 * @param {boolean} ephemeral
 * @param {EmbedSettings} embedSettings
 * @private
 */
async function genericEmbed(interaction, options, ephemeral, embedSettings) {
    verifyArguments(interaction, options);

    const embed = new Discord.EmbedBuilder()
        .setColor(embedSettings.color)
        .setDescription(embedSettings.prefix + options.message);

    embedContentsFromOptions(embed, options);

    if (interaction.deferred)
        return await interaction.editReply({ embeds: [embed] });
    return await interaction.reply({ embeds: [embed], ephemeral });
}

/**
 * The EmbedManager class manages and sends discord.js embeds automatically
 * @class
 */
class EmbedManager {
    constructor(client) {
        this.client = client;
    }

    /**
     * Creates and sends an embed with the SUCCESS style
     * @param {FunctionArguments} param0
     * @returns {Promise<void>}
     */
    async success({ interaction, options, ephemeral }) {
        await genericEmbed(interaction, options, ephemeral, {
            color: Colors.SUCCESS,
            prefix: Prefixes.SUCCESS,
        });
    }

    /**
     * Creates and sends an embed with the ERROR style
     * @param {FunctionArguments} param0
     * @returns {Promise<void>}
     */
    async error({ interaction, options, ephemeral }) {
        await genericEmbed(interaction, options, ephemeral, {
            color: Colors.ERROR,
            prefix: Prefixes.ERROR,
        });
    }

    /**
     * Creates and sends a custom embed
     * @param {FunctionArguments} param0
     * @returns {Promise<void>}
     */
    async default({ interaction, options, ephemeral }) {
        await genericEmbed(interaction, options, ephemeral, {
            color:
                options.color[0].toUpperCase() +
                options.color.slice(1).toLowerCase(),
            prefix: Prefixes.NONE,
        });
    }
}

module.exports = EmbedManager;
