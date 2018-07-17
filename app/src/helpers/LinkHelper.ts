import { getRepository } from "typeorm";
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
        return 1234;
    }
}
