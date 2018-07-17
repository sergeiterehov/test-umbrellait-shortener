import { bitshuffle } from "./bitshuffle";

/**
 * Execute bit shuffle operation
 * @param n Number up to 2^53
 */
export function shuffle(n: number): number {
    if ((2 ** 53) < n) {
        throw new Error("Bit shuffle limit reached (2^53)");
    }

    return bitshuffle(n);
}
