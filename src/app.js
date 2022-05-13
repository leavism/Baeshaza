const config = require('./config.js');
const { SapphireClient } = require('@sapphire/framework');
const has = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

const client = new SapphireClient(
    { 
        defaultPrefix: config.prefix,
        intents: ['GUILDS', 'GUILD_MESSAGES'],
        loadMessageCommandListeners: true
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

String.prototype.titleCase = function () {
    return this.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
        }
    );
};

client.login(config.token);
