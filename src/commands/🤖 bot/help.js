const { SubCommandPluginCommand } = require('@sapphire/plugin-subcommands');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const has = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key)


class HelpCommand extends SubCommandPluginCommand {
    constructor(context, options) {
        super(context, {
            ...options,
            description: 'Displays all of the commands.'
        });
    }

    async messageRun(message, args) {
        const helpContent = await this.container.client.buildHelp()

        const row = new MessageActionRow()
        Object.keys(helpContent).forEach(category => {
            row.addComponents(
                new MessageButton()
                    .setCustomId(`${category}`)
                    .setLabel(`${category}`.titleCase())
                    .setStyle('SECONDARY')
            )
        })

        return await message.channel.send({
            embeds: [await this.buildEmbed(helpContent)],
            components: [row]
        })
    }

    async buildEmbed(helpObj) {
        const helpEmbed = new MessageEmbed()
            .setAuthor({
                name: `${this.container.client.user.tag}`,
                iconURL: `${this.container.client.user.avatarURL()}`
            })
            .setDescription('Here are all the categories of commands. Press the interactive buttons to view all the commands in that category.')
            .setFooter({
                text: 'Press the buttons below to view all the commands for that category.'
            })
        Object.keys(helpObj).forEach((category) => {
            helpEmbed.addField(
                `${category}`.titleCase(),
                `${helpObj[category].length} commands`,
                true
            )
        })
        return helpEmbed
    }
}

exports.HelpCommand = HelpCommand;
