import { container, SapphireClient } from '@sapphire/framework';
import { ClientOptions } from 'discord.js';
import { BaeshazaDB } from './BashazaDB';

export class BaeshazaClient extends SapphireClient {

	public constructor(options: ClientOptions) {
		super(options);
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
	}
}