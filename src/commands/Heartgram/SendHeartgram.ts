import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { ActionRowBuilder, ApplicationCommandType, GuildMember, ModalBuilder, TextInputBuilder, TextInputStyle, UserContextMenuCommandInteraction } from 'discord.js';

@ApplyOptions<Command.Options>({})
export class SendHeartgramCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerContextMenuCommand((builder) =>
			builder
				.setName('Send a Heartgram')
				.setType(ApplicationCommandType.User)
		);
	}

	private buildSendHeartgramModal(interaction: Command.ContextMenuCommandInteraction | Command.ChatInputCommandInteraction): ModalBuilder {
		const targetId: string = interaction instanceof UserContextMenuCommandInteraction ?
			interaction.targetId : interaction.options.getUser('member')!.id;
		const targetDisplayName: string = interaction instanceof UserContextMenuCommandInteraction ?
			interaction.targetMember.displayName : interaction.options.getUser('member')!.username;
		const authorId: string = interaction.member!.user.id;

		const sendHeartgramModal = new ModalBuilder()
			.setCustomId(`sendHeartgramModal?targetId=${targetId}&authorId=${authorId}&anonymous=false`)
			.setTitle(`Send ${targetDisplayName} a Heartgram`);

		const heartgramDescription = new TextInputBuilder()
			.setCustomId('heartgramDescription')
			.setLabel('What do you want to say?')
			.setStyle(TextInputStyle.Paragraph)
			.setPlaceholder('Thanks for being awesome!')
			.setRequired(true);

		const firstActionRow = new ActionRowBuilder().addComponents(heartgramDescription);

		// modals are still weird, tell tsc to ignore checking types for parameter
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore:code
		sendHeartgramModal.addComponents(firstActionRow);

		return sendHeartgramModal;
	}

	public override async contextMenuRun(interaction: Command.ContextMenuCommandInteraction) {
		if (!(interaction.isUserContextMenuCommand() &&
			interaction.targetMember instanceof GuildMember)) return;

		const sendHeartgramModal = this.buildSendHeartgramModal(interaction);

		await interaction.showModal(sendHeartgramModal);
	}
}