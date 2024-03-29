import type { ChatInputCommandSuccessPayload, Command, ContextMenuCommandSuccessPayload, MessageCommandSuccessPayload } from '@sapphire/framework';
import { container } from '@sapphire/framework';
import { cyan } from 'colorette';
import type { APIUser } from 'discord-api-types/v9';
import { Guild, TextBasedChannel, User } from 'discord.js';
import { RandomLoadingMessage } from './constants';

/**
 * Picks a random item from an array
 * @param array The array to pick a random item from
 * @example
 * const randomEntry = pickRandom([1, 2, 3, 4]) // 1
 */
export function pickRandom<T>(array: readonly T[]): T {
	const { length } = array;
	return array[Math.floor(Math.random() * length)];
}

/**
 * Provides a random loading message
 * @returns A random loading message
 */
export function getLoadingMessage(): string {
	return pickRandom(RandomLoadingMessage);
}

/**
 * Finds a specified text channel within a Discord guild
 * @param guild The Discord guild to look in
 * @param channelName The name of the text channel
 * @returns The TextChannel
 */
export async function findTextChannel(guild: Guild, channelName: string): Promise<TextBasedChannel | null> {
	const target = await guild.channels.fetch()
		.then(channels => channels.find(channel => channel?.name === channelName))
		.catch(container.logger.error);

	if (target?.isTextBased()) {
		return target;
	}
	return null;
}

/**
 * Parses a modalId like a URI search query
 * @param modalId String containing the information needed to pass to the modal
 * @returns The parsed modalId as a key-value JS object
 */
export function parseModalId(modalId: string): { [property: string]: string } {
	const query: { [property: string]: string } = {};
	const pairs = (modalId[0] === '?' ? modalId.substring(1) : modalId.substring(modalId.indexOf('?') + 1)).split('&');
	for (let i = 0; i < pairs.length; i++) {
		const pair = pairs[i].split('=');
		query[pair[0]] = pair[1] || '';
	}
	return query;
}

export function logSuccessCommand(payload: ContextMenuCommandSuccessPayload | ChatInputCommandSuccessPayload | MessageCommandSuccessPayload): void {
	let successLoggerData: ReturnType<typeof getSuccessLoggerData>;

	if ('interaction' in payload) {
		successLoggerData = getSuccessLoggerData(payload.interaction.guild, payload.interaction.user, payload.command);
	} else {
		successLoggerData = getSuccessLoggerData(payload.message.guild, payload.message.author, payload.command);
	}

	container.logger.debug(`${successLoggerData.shard} - ${successLoggerData.commandName} ${successLoggerData.author} ${successLoggerData.sentAt}`);
}

export function getSuccessLoggerData(guild: Guild | null, user: User, command: Command) {
	const shard = getShardInfo(guild?.shardId ?? 0);
	const commandName = getCommandInfo(command);
	const author = getAuthorInfo(user);
	const sentAt = getGuildInfo(guild);

	return { shard, commandName, author, sentAt };
}

function getShardInfo(id: number) {
	return `[${cyan(id.toString())}]`;
}

function getCommandInfo(command: Command) {
	return cyan(command.name);
}

function getAuthorInfo(author: User | APIUser) {
	return `${author.username}[${cyan(author.id)}]`;
}

function getGuildInfo(guild: Guild | null) {
	if (guild === null) return 'Direct Messages';
	return `${guild.name}[${cyan(guild.id)}]`;
}
