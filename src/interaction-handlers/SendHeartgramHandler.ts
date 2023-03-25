import { InteractionHandler, InteractionHandlerTypes, PieceContext } from '@sapphire/framework';
import { EmbedBuilder, InteractionResponse, ModalSubmitInteraction } from 'discord.js';
import { findTextChannel, parseModalId } from '../lib/utils';

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

		if (parsedModalId.anonymous === 'false') {
			const author = await this.container.client.users.fetch(parsedModalId.authorId);

			return heartgramEmbed
				.setAuthor({ name: author.username, iconURL: author.avatarURL() || undefined })
				.setTitle(`${author.username} sent you a Heartgram!`);
		}

		return heartgramEmbed
			.setAuthor({ name: 'Secret Admirer' })
			.setTitle('Someone sent you a secret Heartgram!');
	}

	private async buildHeartgramLogEmbed(parsedModalId: { [property: string]: string }, interaction: ModalSubmitInteraction) {
		const author = await this.container.client.users.fetch(parsedModalId.authorId);
		const receiver = await this.container.client.users.fetch(parsedModalId.targetId);
		const heartgramEmbed = new EmbedBuilder()
			.setDescription(interaction.fields.getTextInputValue('heartgramDescription'))
			.setTimestamp();

		if (parsedModalId.anonymous === 'false') {
			return heartgramEmbed
				.setTitle(`${author.username} sent a Heartgram to ${receiver.username}`);
		}

		return heartgramEmbed
			.setTitle(`${author.username} sent a secret Heartgram to ${receiver.username}`);
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

	public async run(interaction: ModalSubmitInteraction): Promise<InteractionResponse<boolean> | undefined> {
		const parsedModalId: { [property: string]: string } = parseModalId(interaction.customId);
		const heartgramRateLimit = this.container.heartgramRateLimitManager.acquire(`heartgram?discordId=${parsedModalId.authorId}`);

		if (parsedModalId.authorId === parsedModalId.targetId) {
			return await interaction.reply({
				content: 'You can\'t send yourself a Heartgram lmao',
				ephemeral: true,
			});
		}

		if (heartgramRateLimit.limited) {
			return await interaction.reply({
				content: 'You can only send two Heartgrams a day',
				ephemeral: true,
			});
		}

		const modLogChannel = await findTextChannel(interaction.guild!, 'mod-log');
		await modLogChannel?.send({ embeds: [await this.buildHeartgramLogEmbed(parsedModalId, interaction)] });
		await this.container.client.users.send(parsedModalId.targetId, { embeds: [await this.buildHeartgramEmbed(parsedModalId, interaction)] });

		heartgramRateLimit.consume();
		return await interaction.reply({
			content: 'Your Heartgram has been sent!',
			ephemeral: true,
		});
	}
}