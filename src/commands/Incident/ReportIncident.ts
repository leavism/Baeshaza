import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { ActionRowBuilder, ApplicationCommandType, GuildMember, ModalBuilder, TextInputBuilder, TextInputStyle, UserContextMenuCommandInteraction } from 'discord.js';

@ApplyOptions<Command.Options>({
	description: 'Report an incident',
})
export class ReportIncidentCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerContextMenuCommand((builder) =>
			builder
				.setName('Report to Baeshaza')
				.setType(ApplicationCommandType.User)
		);

		registry.registerChatInputCommand((builder) =>
			builder
				.setName('report')
				.setDescription(this.description)
				.addUserOption((option) =>
					option
						.setName('culprit')
						.setDescription('Mention the Discord user that is the culprit.')
						.setRequired(true)
				)
		);
	}

	private constructModal(interaction: Command.ContextMenuCommandInteraction | Command.ChatInputCommandInteraction): ModalBuilder {
		const targetId: string = interaction instanceof UserContextMenuCommandInteraction ?
			interaction.targetId : interaction.options.getUser('culprit')!.id;

		const targetDisplayName: string = interaction instanceof UserContextMenuCommandInteraction ?
			interaction.targetMember.displayName : interaction.options.getUser('culprit')!.username;

		const reportIncidentModal = new ModalBuilder()
			.setCustomId(`reportIncidentModal$id=${targetId}`)
			.setTitle(`Report an incident regarding ${targetDisplayName}`);

		const reportIncidentDescription = new TextInputBuilder()
			.setCustomId('reportIncidentDescription')
			.setLabel('What happened?')
			.setStyle(TextInputStyle.Paragraph);

		const firstActionRow = new ActionRowBuilder().addComponents(reportIncidentDescription);

		// modals are still weird, tell tsc to ignore checking types for parameter
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore:code
		reportIncidentModal.addComponents(firstActionRow);

		return reportIncidentModal;
	}

	public override async contextMenuRun(interaction: Command.ContextMenuCommandInteraction) {
		if (!(interaction.isUserContextMenuCommand() &&
			interaction.targetMember instanceof GuildMember)) return;

		const reportIncidentModal = this.constructModal(interaction);

		await interaction.showModal(reportIncidentModal);
	}

	public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const reportIncidentModal = this.constructModal(interaction);

		await interaction.showModal(reportIncidentModal);
	}
}
