"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bitshuffle_1 = require("./bitshuffle");
/**
 * Integer limit when calculations is precis.
 */
const shuffleLimit = (2 ** 53);
class LinkHelper {
    /**
     * Generate the string by bit shuffle operation on the received number
     * @param currentNumber Current state of auto increment
     */
    static generateShuffleString(currentNumber) {
        if (shuffleLimit < currentNumber) {
            throw new Error("Bit shuffle limit reached (2 ** 53)");
        }
        return bitshuffle_1.bitshuffle(currentNumber).toString(36);
    }
}
exports.LinkHelper = LinkHelper;
