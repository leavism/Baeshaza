import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { EmbedBuilder } from 'discord.js';

@ApplyOptions<Command.Options>({
	description: 'Gets info and stats for the Discord bot.',
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand({
			name: this.name,
			description: this.description,
		});
	}

	private constructStatsEmbed(): EmbedBuilder {
		return new EmbedBuilder()
			.setAuthor({ name: `${this.container.client.user?.tag}` })
			.setColor(0x04ff70)
			.setThumbnail(`${this.container.client.user?.avatarURL()}`)
			.addFields(
				{ name: '🍽️ Serving', value: `${this.container.client.guilds.cache.size} server(s)\n${this.container.client.users.cache.size} user(s)` }
			);
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		return await interaction.reply({ embeds: [this.constructStatsEmbed()] });
	}
}
