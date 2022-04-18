const config = require('./config.js');
const { SapphireClient } = require('@sapphire/framework');

const client = new SapphireClient(
    { defaultPrefix: config.prefix,
        intents: ['GUILDS', 'GUILD_MESSAGES']}
);

client.login(config.token);
