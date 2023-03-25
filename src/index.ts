import './lib/setup';
import { LogLevel } from '@sapphire/framework';
import { GatewayIntentBits, Partials } from 'discord.js';
import { BaeshazaClient } from './lib/BaeshazaClient/BaeshazaClient';

const client = new BaeshazaClient({
	caseInsensitiveCommands: true,
	logger: {
		level: LogLevel.Debug,
	},
	shards: 'auto',
	intents: [
		GatewayIntentBits.GuildBans,
		GatewayIntentBits.GuildEmojisAndStickers,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.MessageContent,
	],
	partials: [Partials.Channel],
	loadMessageCommandListeners: true,
});

const main = async () => {
	try {
		client.logger.info('Logging in...');
		await client.login();
		client.logger.info('Successful logged in!');
	} catch (error) {
		client.logger.fatal(error);
		client.destroy();
		process.exit(1);
	}
};

main();