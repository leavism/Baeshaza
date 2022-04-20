const { Command } = require('@sapphire/framework');

class PingCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            description: 'Get the current bot and Discord API latency.'
        });
    }

    async messageRun(message) {
        const msg = await message.channel.send('Ping?');

        const content = `Pong! Bot Latency ${Math.round(this.container.client.ws.ping)}ms. API Latency ${
            msg.createdTimestamp - message.createdTimestamp
        }ms.`;

        return msg.edit(content);
    }
}

exports.PingCommand = PingCommand;