const config = require('./config.js');
const { ScheduledTaskRedisStrategy } = require('@sapphire/plugin-scheduled-tasks/register-redis');
const { SapphireClient } = require('@sapphire/framework');
const has = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

const client = new SapphireClient(
    { 
        intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS'],
        loadMessageCommandListeners: true,
        tasks: {
            strategy: new ScheduledTaskRedisStrategy({
                bull: {
                    redis: {
                        // TODO: Pull these from env file
                        port: 6379,
                        password: 'redispw',
                        host: '127.0.0.1',
                        db: 0
                    },
                    defaultJobOptions: {
                        removeOnComplete: true,
                        removeOnFail: true
                    }
                }
            })
        }
    }
);

client.buildHelp = async function () {
    const help = {};
    const allCommands = this.stores.get('commands');

    await Promise.all(allCommands.map((command) => {
        if (!has(help, command.category)) help[command.category] = [];
        help[command.category].push(command);
    }));
    return help;
};

client.findChannel = async function(guild, name) {
    return guild.channels.cache.find(channel => channel.name == name);
};

String.prototype.titleCase = function () {
    return this.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
        }
    );
};

client.login(config.devToken);

// Uncomment this and run it once to clear the application commands from discord
// setTimeout(() => client.application.commands.set([]), 2500);