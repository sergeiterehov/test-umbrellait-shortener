import { getRepository, getConnection, Raw, LessThan } from "typeorm";
import axios from "axios";
import { redis } from "../db/Redis";
import { Link } from "../entity/Link";
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
     * Returns source url, if exists, and increment it counter
     * @param id Link id
     */
    public static async open(id: string): Promise<string|void> {
        const link = await this.find(id);

        if (! link) {
            return;
        }

        if (0 > link.amountOpen) {
            throw new Error("Link is not verified");
        }

        // Registration on background
        this.registerOpen(link);

        return link.sourceLink;
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
        // Lock link for opening
        link.amountOpen = -1;

        // Exception when parallel access or record already exists
        try {
            await getRepository(Link).insert(link);
        } catch (e) {
            throw new Error("Link already exists");
        }

        // Start check on background
        this.checkLink(link);

        return link;
    }

    /**
     * Register open action (counter)
     * @param link Opened link
     */
    public static async registerOpen(link: Link) {
        await redis.hincrby("opncnt", link.id, 1);
    }

    /**
     * Storing all registered opens
     */
    public static async flushOpens() {
        const items = await this.getFlushOpens();
        const updating = items.map(async (pair) => this.updateAmountOpen(pair[0], pair[1]));

        await Promise.all(updating);
    }

    /**
     * Removing all links by TTL
     * @param ttlDays Interval in days to deleting old links
     */
    public static async cleanByTTL(ttlDays: number) {
        const timeLimit = new Date();

        timeLimit.setDate(timeLimit.getDate() - ttlDays);

        await getRepository(Link).delete({
            createdAt: LessThan(timeLimit),
        });
    }

    /**
     * Checking that url is available
     * @param link Link
     */
    private static async checkLink(link: Link): Promise<boolean> {
        const response = await axios.get(link.sourceLink);

        // TODO: read http status only!

        if (200 !== response.status) {
            await getRepository(Link).delete(link);

            return false;
        }

        // Now link is available for opening
        link.amountOpen = 0;

        await getRepository(Link).save(link);

        return true;
    }

    /**
     * Return counters and delete all
     */
    private static async getFlushOpens(): Promise<[[string, number]]> {
        const records = (await redis.hgetall("opncnt")) as {[key: string]: string};
        const delCompleting = redis.del("opncnt");
        const items = Object.keys(records)
            .map((id: string) => [id, parseInt(records[id], 10)]) as [[string, number]];

        await delCompleting;

        return items;
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
                amountOpen: () => `amountOpen + ${increment}`,
            })
            .where({
                id: (id),
            })
            .execute();

        return id;
    }
}
