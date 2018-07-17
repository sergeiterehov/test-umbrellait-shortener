import { getRepository, getConnection, Raw } from "typeorm";
import { redis } from "./../db/Redis";
import { Link } from "./../entity/Link";
import { shuffle } from "./Shuffle";

/**
 * Helper for shortlink manipulations
 */
export class LinkHelper {
    /**
     * Find link by id
     * @param id Link id
     */
    public static async find(id: string): Promise<Link|undefined> {
        return await getRepository(Link).findOne(id);
    }

    /**
     * Create and store new short link
     * @param sourceLink Source url link
     * @param name Personal name for short link
     */
    public static async createLink(sourceLink: string, name: string|null = null): Promise<Link> {
        const id = name ? name : this.generateShuffleString(await this.generateNextId());

        const link = new Link();

        link.id = id;
        link.createdAt = new Date();
        link.sourceLink = sourceLink;
        link.amountOpen = 0;

        // Exception when parallel access or record already exists
        await getRepository(Link).insert(link);

        return link;
    }

    /**
     * Register open action (counter)
     * @param link Opened link
     */
    public static async registerOpen(link: Link) {
        await redis.hincrby("opcnt", link.id, 1);
    }

    public static async flushOpens() {
        const records = (await redis.hgetall("opcnt")) as {[key: string]: string};
        const items = Object.keys(records)
            .map((id: string) => [id, parseInt(records[id], 10)])
            .map(async (pair: [string, number]) => this.updateAmountOpen(pair[0], pair[1]));

        await Promise.all(items);
    }

    /**
     * Generate the string by bit shuffle operation on the received number
     * @param currentNumber Current state of auto increment
     */
    private static generateShuffleString(currentNumber: number): string {
        return shuffle(currentNumber).toString(36);
    }

    /**
     * Generate the next id for link record. Auto increment counter.
     */
    private static async generateNextId(): Promise<number> {
        return await redis.incr("link_id_counter");
    }

    /**
     * Store cached counter
     * @param id Link id
     * @param increment Inc by
     */
    private static async updateAmountOpen(id: string, increment: number): Promise<string> {
        await getConnection().createQueryBuilder()
            .update("link")
            .set({
                amountOpen: Raw(`amountOpen + ${increment}`),
            })
            .where({
                id: (id),
            })
            .execute();
            // TODO: fix it

        console.log(id, increment);

        return id;
    }
}
