const { Listener } = require('@sapphire/framework');
const { MessageEmbed } = require('discord.js');

class memberLeaveLog extends Listener {
    constructor(context, options = {}) {
        super(context, {
            ...options,
            event: 'guildMemberRemove'
        });
    }

    async run(member) {
        const modLogChannel = await this.container.client.findChannel(member.guild, 'mod-log');

        return modLogChannel.send({
            embeds: [await this.buildLeaveEmbed(member)]
        });
    }

    async buildLeaveEmbed (member) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const createdDaysAgo = `(${Math.round(
            (new Date() - member.user.createdAt) / (24 * 60 * 60 * 1000))} days ago)`;

        return new MessageEmbed()
            .setTitle(`${member.user.tag} has left the ${member.guild.name} Discord`)
            .setThumbnail(member.user.displayAvatarURL())
            .setDescription(`${member.user}`)
            .addField(
                'Joined Discord on',
                `${member.user.createdAt.toLocaleDateString(
                    'en-US',
                    options
                )}\n${createdDaysAgo}`,
                true
            )
            .addField(
                'Left Hearthome on',
                `${new Date().toLocaleDateString('en-US', options)}`,
                true
            )
            .setFooter({
                text: `User ID: ${member.user.id}`
            });
    }
}

exports.memberLeaveLog = memberLeaveLog;
