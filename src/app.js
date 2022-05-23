// const config = require('./config.js');
const { SapphireClient } = require('@sapphire/framework');
const aws = require('aws-sdk');
const has = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

const client = new SapphireClient(
    { 
        intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS'],
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

const s3 = new aws.S3({
    devToken: process.env.devToken,
    realToken: process.env.realToken
});

client.login(s3.devToken);
