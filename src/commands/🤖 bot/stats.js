const { version: sapphireVersion } = require('@sapphire/framework');
const { SubCommandPluginCommand } = require('@sapphire/plugin-subcommands');
const { MessageEmbed, version: discordVersion} = require('discord.js');

class StatsCommand extends SubCommandPluginCommand {
    constructor(context, options) {
        super(context, {
            ...options,
            description: 'Get the current stats for the bot.',
            chatInputCommand: { register: true }
        });
    }

    async chatInputRun(interaction) {
        return await interaction.channel.send({
            embeds: [await this.constructStatsEmbed()]
        });
    }

    async constructStatsEmbed() {
        return new MessageEmbed()
            .setAuthor({ 
                name: `${this.container.client.user.tag}`,
            })
            .setColor(0x04ff70)
            .setThumbnail(this.container.client.user.avatarURL())
            .addField(
                '🍽️ Serving',
                `${this.container.client.guilds.cache.size} Servers\n${this.container.client.users.cache.size} Users`,
                true)
            .addField(
                '🕑 Uptime',
                `${this.container.client.uptime / 1000}s`,
                true)

            .addField(
                '🛠 Developer(s)',
                'Leavism\nAndaroo',
                true
            )
            .addField(
                'GitHub',
                '[Repository](https://github.com/leavism/Baeshaza)',
                true
            )
            .setFooter(
                { text: `Libraries: Sapphire ${sapphireVersion} | Discord.js ${discordVersion} | Node.js ${process.version}`});
    }

}

exports.statsCommand = StatsCommand;
