import { InteractionHandler, InteractionHandlerTypes, PieceContext } from '@sapphire/framework';
import { EmbedBuilder, ModalSubmitInteraction } from 'discord.js';
import { parseModalId } from '../lib/utils';

export class SendHeartgramModalHandler extends InteractionHandler {
	public constructor(context: PieceContext, options: InteractionHandler.Options) {
		super(context, {
			...options,
			interactionHandlerType: InteractionHandlerTypes.ModalSubmit,
		});
	}

	private async buildHeartgramEmbed(parsedModalId: { [property: string]: string }, interaction: ModalSubmitInteraction): Promise<EmbedBuilder> {
		const heartgramEmbed = new EmbedBuilder()
			.setDescription(interaction.fields.getTextInputValue('heartgramDescription'))
			.setTimestamp();

		if (parsedModalId.authorId !== 'anonymous') {
			const author = await this.container.client.users.fetch(parsedModalId.authorId);

			return heartgramEmbed
				.setAuthor({ name: author.username, iconURL: author.avatarURL() || undefined })
				.setTitle(`${author.username} sent you a Heartgram!`);
		}

		return heartgramEmbed
			.setAuthor({ name: 'Secret Admirer' })
			.setTitle('Someone sent you a secret Heartgram!');
	}

	public override async parse(interaction: ModalSubmitInteraction) {
		if (!interaction.customId.startsWith('sendHeartgramModal')) return this.none();

		const parsedModalId: { [property: string]: string } = parseModalId(interaction.customId);

		Promise.all([
			await this.container.database.checkThenCreateUser(parsedModalId.targetId),
			await this.container.database.checkThenCreateUser(parsedModalId.authorId),
		])
			.then(() => {
				this.container.database.createHeartgram({
					receiverDiscordId: parsedModalId.targetId,
					authorDiscordId: parsedModalId.authorId,
					description: interaction.fields.getTextInputValue('heartgramDescription'),
				});
			});
		return this.some();
	}

	public async run(interaction: ModalSubmitInteraction): Promise<void> {
		const parsedModalId: { [property: string]: string } = parseModalId(interaction.customId);

		await this.container.client.users.send(parsedModalId.targetId, { embeds: [await this.buildHeartgramEmbed(parsedModalId, interaction)] });

		await interaction.reply({
			content: 'Your Heartgram has been sent!',
			ephemeral: true,
		});
	}
}