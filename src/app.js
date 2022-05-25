const config = require('./config.js');
const { SapphireClient } = require('@sapphire/framework');
const { ScheduledTaskRedisStrategy } = require('@sapphire/plugin-scheduled-tasks/register-redis');
const has = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

const options =     { 
    intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS'],
    loadMessageCommandListeners: true,
    tasks: {
        // Using bull (redis)
        strategy: new ScheduledTaskRedisStrategy({
            /* You can add your Bull options here, for example we can configure custom Redis connection options: */
            bull: {
                redis: {
                    port: 6379, // Defaults to 6379, but if your Redis server runs on another port configure it here
                    password: '', // If your Redis server requires a password configure it here
                    host: 'localhost', // The host at which the redis server is found
                    db: 2 // Redis database number, defaults to 0 but can be any value between 0 and 15
                }
            }
        })
    }
};

const client = new SapphireClient(options);

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
