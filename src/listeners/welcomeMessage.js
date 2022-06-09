const { Listener } = require('@sapphire/framework');
const { MessageEmbed } = require('discord.js');

class welcomeMessage extends Listener {
    constructor(context, options = {}) {
        super(context, {
            ...options,
            event: 'guildMemberAdd'
        });
    }

    async run(member) {
        const welcomeChannel = member.guild.systemChannel;
        
        return welcomeChannel.send({
            embeds: [await this.buildWelcomeEmbed(member)]
        });
    }

    async buildWelcomeEmbed(member) {
        const rulesChannel = await this.container.client.findChannel(member.guild, 'rules');
        const welcomeChannel = await this.container.client.findChannel(member.guild, 'welcome');

        return new MessageEmbed()
            .setTitle(`Welcome to ${member.guild.name}!`)
            .setThumbnail(member.guild.iconURL())
            .setDescription(`Hey ${member}! You'll be restricted to this channel until we get you verified. Please introduce yourself and let us know what you're looking for in a guild. Let\'s make sure we fit your needs before you join us!`)
            .addField(
                'How to get started',
                `1. Read over ${rulesChannel}.\n2. Introduct yourself in ${welcomeChannel}.\n3. Wait for a leader to verify membership.`,
                false
            )
            .addField(
                'Ways to introduce yourself',
                '- What\'s your main and why aren\'t you a sexy gunlancer?\n- Are you looking to clear any specific content?\n- Did you bring the ceremonial goat for sacrifice?'
            )
            .addField(
                'Want to test the waters?',
                'We offer a trial membership if you\'d like to see how well we fit your needs. This way you won\'t be penalized for leaving us if things don\'t work out!',
                false
            )
            .setFooter(
                {
                    text: 'Make a new friend while you\'re waiting! We don\'t bite :)'
                }
            );
    }

}

exports.welcomeMessage = welcomeMessage;
