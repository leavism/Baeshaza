import { EmbedBuilder } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { GuildMember } from 'discord.js';
import { findTextChannel } from '../lib/utils';

/**
 * Sends a logging message to mod-log channel whenever a user is removed from the Discord server.
 * Due to limitations of Discordjs, if the user is not in the bot's cache, the guildMemberRemove
 * event won't be emitted for them.
 */
@ApplyOptions<ListenerOptions>({})
export class MemberLeaveLog extends Listener {
	public constructor(context: Listener.Context, options: Listener.Options) {
		super(context, {
			...options,
			event: 'guildMemberRemove',
		});
	}

	async buildLeaveEmbed(member: GuildMember) {
		const createdDaysAgo = `(${Math.round((new Date().valueOf() - member.user.createdAt.valueOf()) / (24 * 60 * 60 * 1000))} days ago)`;

		return new EmbedBuilder()
			.setTitle(`${member.user.tag} has left the ${member.guild.name} Discord`)
			.setThumbnail(member.user.displayAvatarURL())
			.setDescription(`${member.user}`)
			.setColor([235, 64, 52])
			.addFields(
				{ name: 'Joined Discord on', value: `${member.user.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}\n${createdDaysAgo}`, inline: true },
				{ name: 'Left Hearthome on', value: `${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, inline: true },
			)
			.setFooter({
				text: `User ID: ${member.user.id}`,
			});
	}

	public async run(member: GuildMember) {
		const modLogChannel = await findTextChannel(member.guild, 'mod-log');

		return modLogChannel?.send({
			embeds: [await this.buildLeaveEmbed(member)],
		});
	}
}