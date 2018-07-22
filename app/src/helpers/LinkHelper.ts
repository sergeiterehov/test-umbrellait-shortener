import { getRepository, getConnection, LessThan, Not } from "typeorm";
import { redis } from "../db/Redis";
import { Link } from "../entity/Link";
import { shuffle, randomString } from "./linkGenerator";
import { config } from "./config";
import { HttpHelper } from "./HttpHelper";
import { log } from "./Log";

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
        const id = name ? name : await this.generateIdString();

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

        log.link.info(`Created link ${link.id} to ${link.sourceLink}`);

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

        log.link.info(`Flushed ${updating.length} links`);
    }

    /**
     * Removing all links by TTL
     * @param ttlDays Interval in days to deleting old links
     */
    public static async cleanByTTL(ttlDays: number) {
        const timeLimit = new Date();

        timeLimit.setDate(timeLimit.getDate() - ttlDays);

        const result = await getRepository(Link).delete({
            createdAt: LessThan(timeLimit),
        });

        log.link.info(["Deleted by TTL", result]);
    }

    /**
     * Returns most popular links
     * @param limit Max number of Links
     */
    public static async getMostPopular(limit: number = 30): Promise<Link[]> {
        return await getRepository(Link).find({
            where: {
                amountOpen: Not(-1),
            },
            order: {
                amountOpen: "DESC",
            },
            take: limit,
        });
    }

    /**
     * Checking that url is available
     * @param link Link
     */
    private static async checkLink(link: Link): Promise<boolean> {
        let available: boolean;

        try {
            available = await HttpHelper.checkAvailable(link.sourceLink);
        } catch (e) {
            available = false;
        }

        if (! available) {
            // Remove the link if unavailable
            await getRepository(Link).delete(link);

            log.link.info(`Rejected ${link.id}`);

            return false;
        }

        // Now link is available for opening
        link.amountOpen = 0;

        await getRepository(Link).save(link);

        log.link.info(`Accepted ${link.id}`);

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
     * Generate the string for using as id
     * @param currentNumber Current state of auto increment
     */
    private static async generateIdString(): Promise<string> {
        switch (config.links.generateMethod) {
            // Absolutely unique numbers, up to ~ 10^15
            case "shuffle": return shuffle(await this.generateNextId()).toString(36);
            // Pseudo random strings, up to ~ 3 * 10^14
            case "random": return randomString(8);
        }

        throw new Error("Service not available");
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
