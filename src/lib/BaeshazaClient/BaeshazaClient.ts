import { container, SapphireClient } from '@sapphire/framework';
import { RateLimitManager } from '@sapphire/ratelimits';
import { Time } from '@sapphire/time-utilities';
import { ClientOptions } from 'discord.js';
import { BaeshazaDB } from './BashazaDB';

export class BaeshazaClient extends SapphireClient {

	public constructor(options: ClientOptions) {
		super(options);
		container.heartgramRateLimitManager = new RateLimitManager(Time.Day * 1, 2);
	}

	public override async login(token?: string) {
		container.database = BaeshazaDB.getInstance();
		return super.login(token);
	}

	public override async destroy() {
		await BaeshazaDB.destroy();
		return super.destroy();
	}
}

declare module '@sapphire/pieces' {
	interface Container {
		database: BaeshazaDB;
		heartgramRateLimitManager: RateLimitManager;
	}
}