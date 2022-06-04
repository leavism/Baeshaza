const { SubCommandPluginCommand } = require('@sapphire/plugin-subcommands');
const { SlashCommandBuilder } = require('@discordjs/builders');

class ReminderCommand extends SubCommandPluginCommand {
    constructor(context, options) {
        super(context, {
            ...options,
            description: 'Get a reminder after the specified time.',
            chatInputCommand: { register: true }
        });
    }

    registerApplicationCommands(registry) {
        const builder = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addNumberOption(option => option.setName('delay').setDescription('The delay in ????').setRequired(true));
        registry.registerChatInputCommand(builder);
    }

    async chatInputRun(interaction) {
        const delay = interaction.options.getNumber('delay');
        console.log(delay);

        this.container.tasks.create(
            'reminder',
            {
                payload: interaction.member.user.id
            },
            0
            // {type: 'default', bullJobOptions: { jobId: interaction.member.id }, delay: delay}
        );

        return await interaction.reply(
            {
                content: 'Reminder set.',
                fetchReply: false
            }
        );
    }
}

exports.ReminderCommand = ReminderCommand;