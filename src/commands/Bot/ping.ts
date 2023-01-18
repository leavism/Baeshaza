import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { ApplicationCommandType, Message } from 'discord.js';

@ApplyOptions<Command.Options>({
	description: 'Get the bot and Discord API latency',
})
export class UserCommand extends Command {
	// Register slash and context menu command
	public override registerApplicationCommands(registry: Command.Registry) {
		// Register slash command
		registry.registerChatInputCommand({
			name: this.name,
			description: this.description,
		});
	}
	// slash command
	public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const msg = await interaction.reply({ content: 'Ping?', fetchReply: true });

		const content = `Pong! Bot Latency ${Math.round(this.container.client.ws.ping)}ms. API Latency ${
			msg.createdTimestamp - interaction.createdTimestamp
		}ms.`;

		return await interaction.editReply({
			content: content,
		});
	}

	// context menu command
	public async contextMenuRun(interaction: Command.ContextMenuCommandInteraction) {
		const msg = await interaction.reply({ content: 'Ping?', fetchReply: true });

		const content = `Pong! Bot Latency ${Math.round(this.container.client.ws.ping)}ms. API Latency ${
			msg.createdTimestamp - interaction.createdTimestamp
		}ms.`;

		return await interaction.editReply({
			content: content,
		});
	}
}
