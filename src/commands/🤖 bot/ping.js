const { Command, PieceContext } = require('@sapphire/framework');

class PingCommand extends Command {
    constructor(context = PieceContext, options) {
        super(context, {
            ...options,
            description: 'Get the current bot and Discord API latency.',
            chatInputCommand: { register: true }
        });
    }

    async chatInputRun(interaction) {
        let msg = await interaction.reply(
            {
                content: 'Ping?',
                fetchReply: true
            }
        );

        const content = `Pong! Bot Latency ${Math.round(this.container.client.ws.ping)}ms. API Latency ${
            msg.createdTimestamp - interaction.createdTimestamp
        }ms.`;

        this.container.tasks.create('updatePing', { id: interaction.user.id });

        await interaction.editReply(content);
    }

}

exports.PingCommand = PingCommand;