import { Incident } from '@prisma/client';
import { getBorderCharacters, table } from 'table';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { Subcommand } from '@sapphire/plugin-subcommands';
import { ActionRowBuilder, ApplicationCommandType, GuildMember, inlineCode, InteractionResponse, ModalBuilder, TextInputBuilder, TextInputStyle, underscore, UserContextMenuCommandInteraction } from 'discord.js';
import { bold, EmbedBuilder } from '@discordjs/builders';

@ApplyOptions<Command.Options>({})
export class ReportIncidentCommand extends Subcommand {
	public constructor(context: Subcommand.Context, options: Subcommand.Options) {
		super(context, {
			...options,
			name: 'incident',
			enabled: false,
			subcommands: [
				{
					name: 'show',
					type: 'group',
					entries: [
						{ name: 'show-all', chatInputRun: 'chatInputShowAll' },
						{ name: 'show-by-id', chatInputRun: 'chatInputShowById' },
					],
				},
				{
					name: 'report',
					chatInputRun: 'chatInputReport',
				},
			],
		});
	}

	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerContextMenuCommand((builder) =>
			builder
				.setName('Report to Baeshaza')
				.setType(ApplicationCommandType.User)
		);

		registry.registerChatInputCommand((builder) =>
			builder
				.setName('incident')
				.setDescription('Suite of commands for incidents')
				.addSubcommandGroup((group) =>
					group
						.setName('show')
						.setDescription('Display suite of commands for incidents')
						.addSubcommand((command) =>
							command
								.setName('show-all')
								.setDescription('List all the incidents pertaining to a member')
								.addUserOption(option =>
									option
										.setName('member')
										.setDescription('Who\'s incidents am I looking for?')
										.setRequired(true)
								)
						)
						.addSubcommand(command =>
							command
								.setName('show-by-id')
								.setDescription('Show a specific incident pertaining to a member')
								.addNumberOption(option =>
									option
										.setName('incident-id')
										.setDescription('What is the ID of the incident?')
										.setRequired(true)
								)
						)
				)
				.addSubcommand(command =>
					command
						.setName('report')
						.setDescription('Report an incident regarding a member')
						.addUserOption(option =>
							option
								.setName('member')
								.setDescription('Who is this incident regarding?')
								.setRequired(true)
						)
				)
		);
	}

	private buildtReportModal(interaction: Command.ContextMenuCommandInteraction | Command.ChatInputCommandInteraction): ModalBuilder {
		const targetId: string = interaction instanceof UserContextMenuCommandInteraction ?
			interaction.targetId : interaction.options.getUser('member')!.id;
		const targetDisplayName: string = interaction instanceof UserContextMenuCommandInteraction ?
			interaction.targetMember.displayName : interaction.options.getUser('member')!.username;
		const authorId: string = interaction.member!.user.id;

		const reportIncidentModal = new ModalBuilder()
			.setCustomId(`reportIncidentModal?targetId=${targetId}&authorId=${authorId}`)
			.setTitle(`Report ${targetDisplayName} to Baeshaza`);

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

	private buildAllIncidentEmbed(interaction: Command.ChatInputCommandInteraction, tableInput: { data: unknown[][], config: object }) {
		return new EmbedBuilder()
			.setAuthor({ name: interaction.options.getUser('member')!.username, iconURL: interaction.options.getUser('member')!.avatarURL() || undefined })
			.setTitle('All Incidents')
			.setDescription(tableInput.data.length == 1 ? 'This member does not have any reported incidents.' : table(tableInput.data, tableInput.config))
			.addFields([
				{ name: 'View Specific Incident', value: `Use ${inlineCode('/incident show show-by-id [id]')} for a detailed view of a specific incident`, inline: false },
				{ name: 'Culprit', value: `${interaction.options.getUser('member')}` },
			])
			.setFooter({ text: `User ID: ${interaction.options.getUser('member')!.id}` })
			.setTimestamp();
	}

	public override async contextMenuRun(interaction: Command.ContextMenuCommandInteraction) {
		if (!(interaction.isUserContextMenuCommand() &&
			interaction.targetMember instanceof GuildMember)) return;

		const reportIncidentModal = this.buildtReportModal(interaction);

		await interaction.showModal(reportIncidentModal);
	}

	public async chatInputReport(interaction: Command.ChatInputCommandInteraction) {
		const reportIncidentModal = this.buildtReportModal(interaction);

		await interaction.showModal(reportIncidentModal);
	}

	public async chatInputShowAll(interaction: Command.ChatInputCommandInteraction): Promise<InteractionResponse<boolean>> {
		const incidents: Incident[] | void = await this.container.database.findAllIncidents(interaction.options.getUser('member')!.id)
			.catch(error => this.container.client.logger.error(error));

		const data: unknown[][] = [[bold('ID'), bold('Description')]];
		incidents!.forEach(element => {
			data.push([`${inlineCode(element.id.toString())} → `, element.description]);
		});

		const config: object = {
			border: getBorderCharacters('void'),
			drawHorizontalLine: () => false,
			columns: [
				{ width: 10, truncate: 10 },
				{ width: 60, truncate: 60 },
			],
		};

		return await interaction.reply({ embeds: [this.buildAllIncidentEmbed(interaction, { data, config })] });
	}

	public async chatInputShowById(interaction: Command.ChatInputCommandInteraction) {
		const incident = await this.container.database.findIncident(interaction.options.getNumber('incident-id')!);
		console.log(incident);
	}
}
