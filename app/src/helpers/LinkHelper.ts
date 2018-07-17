import { getRepository } from "typeorm";
import { Link } from "../entity/Link";
import { bitshuffle } from "./bitshuffle";

/**
 * Integer limit when calculations is precis.
 */
const shuffleLimit: number = (2 ** 53);

/**
 * Helper for shortlink manipulations
 */
export class LinkHelper {
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
        if (shuffleLimit < currentNumber) {
            throw new Error("Bit shuffle limit reached (2 ** 53)");
        }

        return bitshuffle(currentNumber).toString(36);
    }

    /**
     * Generate the next id for link record. Auto increment counter.
     */
    private static async generateNextId(): Promise<number> {
        return 1234;
    }

    /**
     * Find link by id
     * @param id Link id
     */
    private static async find(id: string): Promise<Link|undefined> {
        return await getRepository(Link).findOne(id);
    }
}
