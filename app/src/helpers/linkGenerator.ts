import { bitshuffle } from "./bitshuffle";

/**
 * Chars availadle for rangomString
 */
const randChars = "-_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

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

/**
 * Generate random string
 * @param length String length
 */
export function randomString(length: number = 5): string {
    let result = "";

    for (let i = 0; i < length; i++) {
        result += randChars.charAt(Math.round(Math.random() * randChars.length));
    }

    return result;
}
