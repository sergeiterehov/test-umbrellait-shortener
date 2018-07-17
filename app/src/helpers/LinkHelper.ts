import { bitshuffle } from "./bitshuffle";

/**
 * Integer limit when calculations is precis.
 */
const shuffleLimit: number = (2 ** 53);

export class LinkHelper {
    /**
     * Generate the string by bit shuffle operation on the received number
     * @param currentNumber Current state of auto increment
     */
    public static generateShuffleString(currentNumber: number): string {
        if (shuffleLimit < currentNumber) {
            throw new Error("Bit shuffle limit reached (2 ** 53)");
        }

        return bitshuffle(currentNumber).toString(36);
    }
}
