import { InteractionHandler, InteractionHandlerTypes, PieceContext } from '@sapphire/framework';
import type { ModalSubmitInteraction } from 'discord.js';

export class ReportIncidentModalHandler extends InteractionHandler {
	public constructor(context: PieceContext, options: InteractionHandler.Options) {
		super(context, {
			...options,
			interactionHandlerType: InteractionHandlerTypes.ModalSubmit,
		});
	}

	public override async parse(interaction: ModalSubmitInteraction) {
		if (!interaction.customId.startsWith('reportIncidentModal')) return this.none();

		const targetId: string = interaction.customId.substring('reportIncidentModal'.length + 4);
		await this.container.database.checkThenCreateUser(targetId)
			.then(() => {
				this.container.database.createIncident({
					discordId: targetId,
					description: interaction.fields.getTextInputValue('reportIncidentDescription'),
				});
			});
		return this.some();
	}

	public async run(interaction: ModalSubmitInteraction) {
		await interaction.reply({
			content: 'Your report has been submitted.',
			ephemeral: true,
		});
	}
}