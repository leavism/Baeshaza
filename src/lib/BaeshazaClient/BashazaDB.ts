import { Incident, PrismaClient } from '@prisma/client';

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
	 * @param discordId Discord ID of user
	 */
	public async checkThenCreateUser(discordId: string): Promise<void> {
		if (await this.checkUser(discordId)) return;
		return await this.createUser(discordId);
	}

	/**
	 * Creates an incident entry in the database
	 * @param report Object containing info pertaining to the incident entry
	 */
	public async createIncident(report: { culpritDiscordId: string, authorDiscordId: string, description: string, }): Promise<void> {
		await BaeshazaDB.instance.incident.create({
			data: {
				culprit: {
					connect: { discord_id: report.culpritDiscordId },
				},
				author: {
					connect: { discord_id: report.authorDiscordId },
				},
				description: report.description,
			},
		});
	}

	public async createHeartgram(heartgram: { receiverDiscordId: string, authorDiscordId: string, description: string, }): Promise<void> {
		await BaeshazaDB.instance.incident.create({
			data: {
				culprit: {
					connect: { discord_id: heartgram.receiverDiscordId },
				},
				author: {
					connect: { discord_id: heartgram.authorDiscordId },
				},
				description: heartgram.description,
			},
		});
	}

	/**
	 * Gets all the incidents pertaining to a Discord user
	 * @param discordId Discord ID of target user
	 * @returns A List of modal incident
	 */
	public async findAllIncidents(discordId: string): Promise<Incident[]> {
		return await BaeshazaDB.instance.incident.findMany({
			where: {
				culprit: {
					discord_id: discordId,
				},
			},
		});
	}

	/**
	 * Gets an incident
	 * @param indicentID The ID of the incident
	 * @returns The incident modal
	 */
	public async findIncident(indicentID: number): Promise<Incident | null> {
		return await BaeshazaDB.instance.incident.findUnique({
			where: {
				id: indicentID,
			},
		});
	}

	/**
	 * Does the procedure of closing the database connection
	 */
	public static destroy(): void {
		BaeshazaDB.instance.$disconnect();
	}
}