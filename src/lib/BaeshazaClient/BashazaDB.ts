import { PrismaClient } from '@prisma/client';

/**
 * Custom class that connects to Prisma for the sqlite database
 * Follows singleton design pattern
 */
export class BaeshazaDB extends PrismaClient {
	private static instance: BaeshazaDB;

	private constructor() {
		super();
	}

	public static getInstance(): BaeshazaDB {
		if (!BaeshazaDB.instance) BaeshazaDB.instance = new BaeshazaDB();
		return BaeshazaDB.instance;
	}

	/**
	 * Checks whether a user entry with the given Discord ID exists in the database
	 * @param discordId Discord ID of user to check
	 * @returns Boolean true if found, false if not
	 */
	private async checkUser(discordId: string): Promise<boolean> {
		const exist = await BaeshazaDB.instance.user.findUnique({
			where: {
				discord_id: discordId,
			},
		});

		// !! is double ! operator, basically gets the boolean value of an object
		return !!exist;
	}

	/**
	 * Creates an database entry for a user
	 * @param discordId Discord ID of user to create
	 */
	private async createUser(discordId: string): Promise<void> {
		await BaeshazaDB.instance.user.create({
			data: {
				discord_id: discordId,
			},
		});
	}

	/**
	 * Checks whether a user entry exists, then creates it in the database
	 * @param discordId Discord ID of user to check then create
	 */
	public async checkThenCreateUser(discordId: string): Promise<void> {
		if (await this.checkUser(discordId)) return;
		await this.createUser(discordId);
	}

	/**
	 * Creates an incident entry in the database
	 * @param incident Object containing info pertaining to the incident entry
	 */
	public async createIncident(incident: {
		discordId: string,
		description: string,
	}): Promise<void> {
		await BaeshazaDB.instance.user.update({
			where: {
				discord_id: incident.discordId,
			},
			data: {
				incidences: {
					create: { description: incident.description },
				},
			},
		});
	}

	public static destroy(): void {
		BaeshazaDB.instance.$disconnect();
	}
}