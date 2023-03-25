import { EmbedBuilder } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { GuildMember } from 'discord.js';
import { findTextChannel } from '../lib/utils';

/**
 * Sends a logging message to mod-log channel whenever a user joins the Discord server.
 */
@ApplyOptions<ListenerOptions>({})
export class MemberJoinLog extends Listener {
	public constructor(context: Listener.Context, options: Listener.Options) {
		super(context, {
			...options,
			event: 'guildMemberAdd',
		});
	}

	async buildJoinEmbed(member: GuildMember) {
		const createdDaysAgo = `(${Math.round((new Date().valueOf() - member.user.createdAt.valueOf()) / (24 * 60 * 60 * 1000))} days ago)`;

		return new EmbedBuilder()
			.setTitle(`${member.user.tag} has joined the ${member.guild.name} Discord`)
			.setThumbnail(member.user.displayAvatarURL())
			.setDescription(`${member.user}`)
			.setColor([29, 245, 87])
			.addFields(
				{ name: 'Joined Discord on', value: `${member.user.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}\n${createdDaysAgo}`, inline: true },
				{ name: 'Joined Hearthome on', value: `${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, inline: true },
			)
			.setFooter({
				text: `User ID: ${member.user.id}`,
			});
	}

	public async run(member: GuildMember) {
		const modLogChannel = await findTextChannel(member.guild, 'mod-log');

		return modLogChannel?.send({
			embeds: [await this.buildJoinEmbed(member)],
		});
	}
}