import { InteractionHandler, InteractionHandlerTypes, PieceContext } from '@sapphire/framework';
import type { ModalSubmitInteraction } from 'discord.js';
import { parseModalId } from '../lib/utils';

export class ReportIncidentModalHandler extends InteractionHandler {
	public constructor(context: PieceContext, options: InteractionHandler.Options) {
		super(context, {
			...options,
			interactionHandlerType: InteractionHandlerTypes.ModalSubmit,
		});
	}

	public override async parse(interaction: ModalSubmitInteraction) {
		if (!interaction.customId.startsWith('reportIncidentModal')) return this.none();

		const parsedModalId: { [property: string]: string } = parseModalId(interaction.customId);

		Promise.all([
			await this.container.database.checkThenCreateUser(parsedModalId.targetId),
			await this.container.database.checkThenCreateUser(parsedModalId.authorId),
		])
			.then(() => {
				this.container.database.createIncident({
					culpritDiscordId: parsedModalId.targetId,
					authorDiscordId: parsedModalId.authorId,
					description: interaction.fields.getTextInputValue('reportIncidentDescription'),
				});
			});
		return this.some();
	}

	public async run(interaction: ModalSubmitInteraction): Promise<void> {
		await interaction.reply({
			content: 'Your report has been submitted.',
			ephemeral: true,
		});
	}
}