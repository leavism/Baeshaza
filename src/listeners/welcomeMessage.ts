import { EmbedBuilder } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { GuildMember } from 'discord.js';
import { findTextChannel } from '../lib/utils';

@ApplyOptions<ListenerOptions>({})
export class WelcomeMessage extends Listener {
	public constructor(context: Listener.Context, options: Listener.Options) {
		super(context, {
			...options,
			event: 'guildMemberAdd',
		});
	}

	private async buildWelcomeEmbed(member: GuildMember): Promise<EmbedBuilder> {
		const rulesChannel = await findTextChannel(member.guild, 'rules');
		const welcomeChannel = await findTextChannel(member.guild, 'welcome');

		return new EmbedBuilder()
			.setTitle(`Welcome to ${member.guild.name}!`)
			.setThumbnail(member.guild.iconURL())
			.setDescription(`Hey ${member}! You'll be restricted to this channel until we get you verified. Please introduce yourself and let us know what you're looking for in a guild. Let's make sure we fit your needs before you join us!`)
			.addFields(
				{
					name: 'How to get started',
					value: `1. Read over ${rulesChannel}.\n2. Introduct yourself in ${welcomeChannel}.\n3. Wait for a leader to verify membership.`,
					inline: false,
				},
				{
					name: 'Ways to introduce yourself',
					value: '- What\'s your main and why aren\'t you a sexy gunlancer?\n- Are you looking to clear any specific content?\n- Did you bring the ceremonial goat for sacrifice?',
					inline: false,
				},
				{
					name: 'Want to test the waters?',
					value: 'We offer a trial membership if you\'d like to see how well we fit your needs. This way you won\'t be penalized for leaving us if things don\'t work out!',
					inline: false,
				}
			)
			.setFooter(
				{
					text: 'Make a new friend while you\'re waiting! We don\'t bite :)',
				},
			);
	}

	public async run(member: GuildMember) {
		const welcomeChannel = member.guild.systemChannel;
		return welcomeChannel?.send({
			embeds: [await this.buildWelcomeEmbed(member)],
		});
	}
}
